// 글 머리의 4컷 만화를 한 컷씩 1080×1080 PNG로 뽑는다 (인스타그램 · 네이버 클립용).
//
//   npm run dev                     # 다른 창에서 사이트를 띄워 두고
//   node scripts/export-comic.mjs http://localhost:4322/blog/<글 주소>/
//   node scripts/export-comic.mjs http://localhost:4322/en/blog/breath-is-your-brains-switch/
//
// 결과: exports/comic/<글 주소 마지막 부분>/panel-1.png … panel-4.png
// 화면 크기와 상관없이 컷을 360px 정사각형으로 고정한 뒤 3배율로 찍어 1080px이 되게 한다.
import fs from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';

const url = process.argv[2];
if (!url) {
  console.error('사용법: node scripts/export-comic.mjs <글 주소>');
  process.exit(1);
}
const name = decodeURIComponent(new URL(url).pathname.split('/').filter(Boolean).pop() ?? 'comic');
const outDir = path.resolve('exports/comic', name);
await fs.mkdir(outDir, { recursive: true });

// Playwright 전용 브라우저가 없으면 설치된 Chrome을 쓴다
const browser = await chromium.launch().catch(() => chromium.launch({ channel: 'chrome' }));
const page = await browser.newPage({ viewport: { width: 1600, height: 1000 }, deviceScaleFactor: 3, reducedMotion: 'reduce' });
await page.goto(url, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
await page.addStyleTag({
  content: `
    astro-dev-toolbar { display: none !important; }
    .comic-grid { grid-template-columns: repeat(4, 360px) !important; gap: 24px !important; }
    .comic-panel { width: 360px !important; height: 360px !important; box-shadow: none !important; border: 0 !important; border-radius: 0 !important; }
  `,
});
const panels = page.locator('[data-comic] .comic-panel');
const count = await panels.count();
if (!count) {
  console.error('이 페이지에는 4컷 만화가 없습니다.');
  process.exit(1);
}
for (let i = 0; i < count; i++) {
  const file = path.join(outDir, `panel-${i + 1}.png`);
  // 소수점 위치 때문에 1px씩 어긋나지 않도록 정확히 360×360 영역을 잘라 찍는다
  const box = (await panels.nth(i).boundingBox());
  await page.screenshot({ path: file, fullPage: true, clip: { x: Math.round(box.x), y: Math.round(box.y), width: 360, height: 360 } });
  console.log(`✓ ${path.relative(process.cwd(), file)}`);
}
await browser.close();
