import { defineConfig } from 'astro/config';

import sitemap from '@astrojs/sitemap';
import sharp from 'sharp';
import { copyFile } from 'node:fs/promises';

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
const sitemapAlias = {
  name: 'sitemap-alias',
  hooks: {
    'astro:build:done': async ({ dir, logger }) => {
      const index = new URL('sitemap-index.xml', dir);
      await copyFile(index, new URL('sitemap.xml', dir));
      logger.info('`sitemap.xml` created from sitemap-index.xml');
    },
  },
};

export default defineConfig({
  site: 'https://jes-lu.com',
  trailingSlash: 'ignore',
  build: { format: 'directory' },
  markdown: { rehypePlugins: [imageAttributes] },
  integrations: [sitemap({ filter: (page) => !page.includes('/404') }), sitemapAlias],
});
