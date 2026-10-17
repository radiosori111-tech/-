// 티스토리 공개 글을 src/content/blog/ 아래 마크다운 파일로 옮긴다.
//
//   node scripts/tistory-import.mjs https://t1-ilu.tistory.com           # 전체
//   node scripts/tistory-import.mjs https://t1-ilu.tistory.com --limit 3 # 앞의 3편만
//
// - 글 목록은 블로그의 sitemap.xml에서 /entry/ 주소를 읽는다.
// - frontmatter의 slug는 티스토리 주소의 /entry/ 뒷부분 그대로라서 /entry/… → /blog/… 리디렉션과 맞물린다.
// - 티스토리 이미지 주소는 서명이 붙어 기한이 지나면 열리지 않으므로, 이미지를 내려받아
//   public/images/blog/<글 id>/ 아래 WebP로 저장하고 본문 주소를 바꾼다.
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import * as cheerio from 'cheerio';
import TurndownService from 'turndown';
import sharp from 'sharp';

const OUT_DIR = path.resolve('src/content/blog');
const IMG_DIR = path.resolve('public/images/blog');
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130 Safari/537.36';
const DELAY_MS = 700; // 블로그에 부담을 주지 않도록 글 사이에 쉰다
const MAX_IMG_WIDTH = 1600;

const args = process.argv.slice(2);
const blog = (args.find((a) => a.startsWith('http')) ?? '').replace(/\/+$/, '');
const limitAt = args.indexOf('--limit');
const limit = limitAt >= 0 ? Number(args[limitAt + 1]) : Infinity;
if (!blog) {
  console.error('사용법: node scripts/tistory-import.mjs <티스토리 주소> [--limit N]');
  process.exit(1);
}
const blogHost = new URL(blog).host;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchWithRetry(url) {
  for (let attempt = 1; ; attempt++) {
    try {
      const res = await fetch(url, { headers: { 'User-Agent': UA, Referer: blog } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res;
    } catch (err) {
      if (attempt >= 3) throw new Error(`${url.slice(0, 120)} 를 가져오지 못했습니다: ${err.message}`);
      await sleep(1500 * attempt);
    }
  }
}
const getText = async (url) => (await fetchWithRetry(url)).text();

// 이미지를 내려받아 WebP로 저장하고 사이트 안 주소를 돌려준다
async function saveImage(src, dir, name) {
  const buf = Buffer.from(await (await fetchWithRetry(src)).arrayBuffer());
  const file = path.join(dir, `${name}.webp`);
  await sharp(buf, { animated: true })
    .resize({ width: MAX_IMG_WIDTH, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(file);
  return '/' + path.relative(path.resolve('public'), file).split(path.sep).join('/');
}

const td = new TurndownService({ headingStyle: 'atx', bulletListMarker: '-', emDelimiter: '*' });
// 글꼴 색·밑줄 같은 장식은 버리고 글자만 남긴다
td.addRule('plainInline', { filter: ['span', 'u', 'font'], replacement: (content) => content });
// 한국어는 **굵게**)조사 형태에서 마크다운 강조가 깨지므로 HTML 태그로 둔다
td.addRule('strong', {
  filter: ['strong', 'b'],
  replacement: (content) => (content.trim() ? `<strong>${content.trim()}</strong>` : content),
});
td.addRule('figure', {
  filter: 'figure',
  replacement: (content, node) => {
    const img = node.querySelector('img');
    if (!img) return content;
    const src = img.getAttribute('src') || '';
    const caption = node.querySelector('figcaption')?.textContent.trim() ?? '';
    const alt = (img.getAttribute('alt') || caption).replace(/[\[\]]/g, '');
    return `\n\n![${alt}](${src})${caption ? `\n*${caption}*` : ''}\n\n`;
  },
});

function cleanBody($, root) {
  root.find('script, style, ins.adsbygoogle, .revenue_unit_wrap, .another_category, .container_postbtn').remove();
  root.find('img').each((_, el) => {
    const img = $(el);
    const src = img.attr('data-url') || img.attr('data-src') || img.attr('src') || '';
    img.attr('src', src.startsWith('//') ? `https:${src}` : src);
  });
  root.find('span.imageblock, div.imageblock').each((_, el) => {
    const block = $(el);
    if (block.closest('figure').length) return;
    block.replaceWith(`<figure>${block.find('img').first().toString()}<figcaption>${block.find('.cap1, figcaption').text()}</figcaption></figure>`);
  });
  // 제목 안의 줄바꿈은 제목 형식을 깨뜨린다
  root.find('h1, h2, h3, h4, h5, h6').each((_, el) => {
    const h = $(el);
    h.find('br').replaceWith(' ');
    h.text(h.text().replace(/\s+/g, ' ').trim());
    if (!h.text()) h.remove();
  });
  // 같은 블로그의 다른 글 링크는 새 사이트 주소로 바꾼다
  root.find('a[href]').each((_, el) => {
    const a = $(el);
    try {
      const u = new URL(a.attr('href'), blog);
      if (u.host === blogHost && u.pathname.startsWith('/entry/')) a.attr('href', `/blog/${u.pathname.slice(7)}/`);
    } catch {}
  });
  // 빈 문단(줄 띄우기용 &nbsp;, <br>)은 지운다
  root.find('p').each((_, el) => {
    const p = $(el);
    if (!p.text().replace(/ /g, '').trim() && !p.find('img').length) p.remove();
  });
}

function tidyMarkdown(md) {
  return md
    .replace(/ /g, ' ')
    .replace(/[ \t]+$/gm, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim() + '\n';
}

// 첫 문단에서 160자 안쪽으로 문장 단위로 자른 요약
function summarize($, root) {
  const text = root.find('p').map((_, p) => $(p).text().replace(/\s+/g, ' ').trim()).get().find((t) => t.length > 40) ?? '';
  if (text.length <= 160) return text;
  const cut = text.slice(0, 160);
  const end = Math.max(cut.lastIndexOf('다.'), cut.lastIndexOf('요.'), cut.lastIndexOf('. '));
  return end > 60 ? cut.slice(0, end + 2).trim() : cut.trim() + '…';
}

// 티스토리 제목에 섞인 줄바꿈 없는 공백(&nbsp;)은 긴 제목이 줄을 넘기지 못하게 하므로 보통 공백으로 바꾼다
const yamlString = (s) => JSON.stringify(String(s ?? '').replace(/ /g, ' '));
const safeFileName = (slug) => slug.replace(/[\\/:*?"<>|]/g, '').replace(/\s+/g, '-').slice(0, 120) || 'post';

async function convert(url) {
  const html = await getText(url);
  const $ = cheerio.load(html);
  const meta = (p) => $(`meta[property="${p}"]`).attr('content')?.trim() ?? '';
  const title = meta('og:title') || $('title').text().trim();
  const date = meta('article:published_time');
  const modified = meta('article:modified_time');
  const category = $('a[href^="/category"]').first().text().trim();
  const tags = [...new Set($('a[rel="tag"]').map((_, a) => $(a).text().trim()).get().filter(Boolean))];
  const slug = decodeURIComponent(new URL(url).pathname.replace(/^\/entry\//, ''));
  const id = crypto.createHash('sha1').update(slug).digest('hex').slice(0, 10);

  const root = $('.tt_article_useless_p_margin, .article_skin .contents_style').first();
  if (!root.length) throw new Error(`${url} 에서 본문 영역을 찾지 못했습니다`);
  cleanBody($, root);
  const description = summarize($, root);

  // 이미지 저장
  const dir = path.join(IMG_DIR, id);
  await fs.rm(dir, { recursive: true, force: true });
  await fs.mkdir(dir, { recursive: true });
  const imgs = root.find('img').toArray();
  let n = 0;
  for (const el of imgs) {
    const src = $(el).attr('src');
    if (!src || !/^https?:/.test(src)) continue;
    $(el).attr('src', await saveImage(src, dir, String(++n).padStart(2, '0')));
  }
  // 본문 이미지가 없는 글의 og:image는 티스토리 기본 로고라서 대표 이미지로 쓰지 않는다
  const cover = n ? $(imgs[0]).attr('src') : '';
  if (!n) await fs.rm(dir, { recursive: true, force: true });

  const body = tidyMarkdown(td.turndown(root.html() ?? ''));
  const front = [
    '---',
    `title: ${yamlString(title)}`,
    `slug: ${yamlString(slug)}`,
    `description: ${yamlString(description)}`,
    `date: ${yamlString(date)}`,
    modified && modified !== date ? `updated: ${yamlString(modified)}` : null,
    category && category !== '카테고리 없음' ? `category: ${yamlString(category)}` : null,
    `tags: [${tags.map(yamlString).join(', ')}]`,
    cover ? `image: ${yamlString(cover)}` : null,
    `source: ${yamlString(url)}`,
    '---',
    '',
  ].filter((l) => l !== null).join('\n');

  // 다시 가져올 때, 이미 넣어 둔 4컷 만화(comic:)는 그대로 옮겨 둔다
  const file = path.join(OUT_DIR, `${safeFileName(slug)}.md`);
  const old = await fs.readFile(file, 'utf8').catch(() => '');
  const comic = old.match(/^comic:[\s\S]*?(?=^---$)/m)?.[0] ?? '';
  const frontWithComic = comic ? front.replace(/---\n$/, `${comic}---\n`) : front;
  await fs.writeFile(file, `${frontWithComic}\n${body}`, 'utf8');
  return { title, images: n, chars: body.length };
}

const sitemap = await getText(`${blog}/sitemap.xml`);
const urls = [...sitemap.matchAll(/<loc>\s*([^<\s]+\/entry\/[^<\s]+)\s*<\/loc>/g)].map((m) => m[1]);
console.log(`사이트맵에서 글 ${urls.length}편을 찾았습니다.`);
await fs.mkdir(OUT_DIR, { recursive: true });
await fs.mkdir(IMG_DIR, { recursive: true });

const failed = [];
let done = 0;
for (const url of urls.slice(0, limit)) {
  try {
    const r = await convert(url);
    done++;
    console.log(`✓ ${String(done).padStart(2)} ${r.title} (본문 ${r.chars}자, 이미지 ${r.images}개)`);
  } catch (err) {
    failed.push(url);
    console.log(`✗ ${err.message}`);
  }
  await sleep(DELAY_MS);
}
console.log(`\n완료: ${done}편 저장, 실패 ${failed.length}편 → ${path.relative(process.cwd(), OUT_DIR)}`);
if (failed.length) console.log(failed.join('\n'));
