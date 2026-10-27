import { defineConfig } from 'astro/config';

import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import preact from '@astrojs/preact';
import sharp from 'sharp';
import { copyFile, readdir, readFile, writeFile } from 'node:fs/promises';
import fs from 'node:fs';
import path from 'node:path';

const SITE_URL = 'https://jes-lu.com';
const SITEMAP_LOCALES = { ko: 'ko-KR', en: 'en-US', ja: 'ja-JP' };

// 사이트맵 lastmod를 한국 시간으로 적는다 (src/data/site.ts의 seoulISO와 같은 형식: 2026-10-14T00:54:00+09:00).
// @astrojs/sitemap은 lastmod를 항상 UTC(…Z)로 바꿔 쓰므로, 빌드가 끝난 뒤 sitemapAlias에서 다시 바꾼다.
function seoulISO(d) {
  const p = Object.fromEntries(new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Seoul', hourCycle: 'h23',
    year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit',
  }).formatToParts(d).map((x) => [x.type, x.value]));
  return `${p.year}-${p.month}-${p.day}T${p.hour}:${p.minute}:${p.second}+09:00`;
}

// 번역 글은 언어마다 주소(slug)가 달라서 sitemap 통합의 i18n 설정만으로는 서로 묶이지 않는다.
// 글 파일의 frontmatter(lang · slug · translationOf)를 읽어 주소 → 같은 글의 언어별 주소 목록을 만든다.
function translationLinks() {
  const field = (src, name) => src.match(new RegExp(`^${name}:\\s*"?(.*?)"?\\s*$`, 'm'))?.[1] ?? '';
  const mdFiles = (dir) =>
    fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
      e.isDirectory() ? mdFiles(path.join(dir, e.name)) : /\.mdx?$/.test(e.name) ? [path.join(dir, e.name)] : [],
    );
  const groups = new Map();
  // 글 주소 → 마지막 수정일 (updated가 없으면 date)
  const modified = new Map();
  const dateOf = (src) => field(src, 'updated') || field(src, 'date');
  const add = (key, lang, pathname) => {
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push({ lang, pathname });
  };
  for (const file of mdFiles('src/content/blog')) {
    const src = fs.readFileSync(file, 'utf8');
    const lang = field(src, 'lang') || 'ko';
    const slug = field(src, 'slug');
    const blogPath = `${lang === 'ko' ? '' : `/${lang}`}/blog/${slug}/`;
    add(`blog:${field(src, 'translationOf') || slug}`, lang, blogPath);
    if (dateOf(src)) modified.set(blogPath, new Date(dateOf(src)));
  }
  for (const file of mdFiles('src/content/articles')) {
    const src = fs.readFileSync(file, 'utf8');
    const lang = field(src, 'lang') || 'ko';
    const name = path.basename(file).replace(/\.mdx?$/, '');
    const articlePath = `${lang === 'ko' ? '' : `/${lang}`}/articles/${name}/`;
    add(`articles:${field(src, 'translationOf') || name}`, lang, articlePath);
    if (dateOf(src)) modified.set(articlePath, new Date(dateOf(src)));
  }
  // 첫 화면은 블로그 목록(/, /en/, /ja/), 아티클 목록은 /articles/, /en/articles/, /ja/articles/
  add('home', 'ko', '/');
  add('home', 'en', '/en/');
  add('home', 'ja', '/ja/');
  add('articles-index', 'ko', '/articles/');
  add('articles-index', 'en', '/en/articles/');
  add('articles-index', 'ja', '/ja/articles/');
  const byPath = new Map();
  for (const members of groups.values()) {
    if (members.length < 2) continue;
    const order = Object.keys(SITEMAP_LOCALES);
    members.sort((a, b) => order.indexOf(a.lang) - order.indexOf(b.lang));
    const url = (p) => new URL(p, SITE_URL).href;
    const links = members.map((m) => ({ lang: SITEMAP_LOCALES[m.lang], url: url(m.pathname) }));
    const fallback = members.find((m) => m.lang === 'ko') ?? members[0];
    links.push({ lang: 'x-default', url: url(fallback.pathname) });
    for (const m of members) byPath.set(m.pathname, links);
  }
  return { byPath, modified };
}
const { byPath: TRANSLATION_LINKS, modified: LAST_MODIFIED } = translationLinks();

// 본문 이미지(public/ 아래)에 실제 가로·세로 크기를 적어 로딩 중 화면이 밀리지 않게 하고,
// 첫 이미지를 뺀 나머지는 화면에 가까워질 때 불러온다.
function imageAttributes() {
  return async (tree) => {
    const imgs = [];
    const walk = (node) => {
      if (node.type === 'element' && node.tagName === 'img') imgs.push(node);
      node.children?.forEach(walk);
    };
    walk(tree);
    await Promise.all(imgs.map(async (img, i) => {
      const src = String(img.properties.src ?? '');
      img.properties.decoding = 'async';
      if (i > 0) img.properties.loading = 'lazy';
      if (!src.startsWith('/')) return;
      try {
        const { width, height } = await sharp(`public${decodeURI(src)}`).metadata();
        Object.assign(img.properties, { width, height });
      } catch {}
    }));
  };
}

// @astrojs/sitemap은 sitemap-index.xml만 만든다. 흔히 찾는 /sitemap.xml 주소로도 열리도록
// 빌드가 끝난 뒤 같은 내용을 sitemap.xml로 한 부 더 써 둔다. (sitemap 통합 다음에 와야 한다)
// 그 전에 사이트맵 파일들의 lastmod(UTC)를 한국 시간으로 바꾼다.
const sitemapAlias = {
  name: 'sitemap-alias',
  hooks: {
    'astro:build:done': async ({ dir, logger }) => {
      const files = (await readdir(dir)).filter((f) => /^sitemap-.*\.xml$/.test(f));
      for (const f of files) {
        const file = new URL(f, dir);
        const xml = await readFile(file, 'utf8');
        await writeFile(file, xml.replace(/<lastmod>([^<]+)<\/lastmod>/g, (_, v) => `<lastmod>${seoulISO(new Date(v))}</lastmod>`));
      }
      const index = new URL('sitemap-index.xml', dir);
      await copyFile(index, new URL('sitemap.xml', dir));
      logger.info('`sitemap.xml` created from sitemap-index.xml');
    },
  },
};

export default defineConfig({
  site: SITE_URL,
  trailingSlash: 'ignore',
  build: { format: 'directory' },
  markdown: { rehypePlugins: [imageAttributes] },
  // 한국어가 기본(주소 앞 표시 없음), 영어 · 일본어는 /en/ · /ja/로 시작한다
  i18n: {
    defaultLocale: 'ko',
    locales: ['ko', 'en', 'ja'],
    routing: { prefixDefaultLocale: false },
  },
  // 글 안의 인터랙티브 위젯: MDX에서 Preact 섬(island)을 쓰고, 화면에 보일 때만 스크립트를 불러온다(client:visible)
  integrations: [mdx(), preact(), sitemap({
      filter: (page) => !page.includes('/404'),
      // 같은 경로의 언어별 페이지(/blog/ ↔ /en/blog/ ↔ /ja/blog/)를 xhtml:link로 서로 묶는다.
      i18n: { defaultLocale: 'ko', locales: SITEMAP_LOCALES },
      // 글마다 주소가 다른 번역 글(블로그 · 아티클)은 translationLinks()로 만든 언어별 주소를 붙인다
      serialize(item) {
        const path = decodeURI(new URL(item.url).pathname);
        const links = TRANSLATION_LINKS.get(path);
        const lastmod = LAST_MODIFIED.get(path);
        return { ...item, ...(links && { links }), ...(lastmod && !isNaN(lastmod) && { lastmod: lastmod.toISOString() }) };
      },
    }), sitemapAlias],
});
