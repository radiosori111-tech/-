// 카드뉴스 데이터(JSON)를 템플릿에 넣어 두 파일을 만든다
//  exports/cardnews/<이름>.html          내 컴퓨터에서 열어 PNG·PDF로 저장하는 파일
//  exports/cardnews/<이름>.artifact.html 팝업(Artifact)으로 미리 보는 파일 (PNG는 downloads 기능으로 저장, PDF 버튼 없음, 허용된 글꼴만)
//  ../카드뉴스/<이름>/<이름>-01~06.png    인스타그램에 바로 올리는 PNG (Edge로 자동 촬영)
// 사용: node scripts/cardnews/build.mjs scripts/cardnews/data/<이름>.json
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const src = process.argv[2];
if (!src) throw new Error('데이터 파일 경로를 넣어 주세요');
const data = JSON.parse(readFileSync(src, 'utf8'));
data.file ??= basename(src, '.json');
const tpl = readFileSync(join(here, 'template.html'), 'utf8');
const out = join(here, '..', '..', 'exports', 'cardnews');
mkdirSync(out, { recursive: true });

const esc = (s) => s.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
// 영어·일본어판은 data.lang으로 문서 언어를 바꾸고, 일본어는 일본어 글꼴을 먼저 쓴다
const lang = data.lang || 'ko';
const page = tpl
  .replace('<html lang="ko">', `<html lang="${lang}">`)
  .replace('family=Noto+Sans+KR:', lang === 'ja' ? 'family=Noto+Sans+JP:wght@500;700;800;900&family=Noto+Sans+KR:' : 'family=Noto+Sans+KR:')
  .replace("--font: 'Pretendard Variable',", lang === 'ja' ? "--font: 'Noto Sans JP', 'Pretendard Variable'," : "--font: 'Pretendard Variable',")
  .replace('<title>카드뉴스</title>', `<title>${esc(data.name || data.title)}</title>`)
  .replace('/*DATA*/null', JSON.stringify(data).replace(/</g, '\\u003c'));
writeFileSync(join(out, `${data.file}.html`), page);

// 팝업용: 문서 뼈대는 게시할 때 붙으므로 빼고, 팝업에서 막히는 인쇄(PDF)는 숨긴다
const artifact = page
  .replace(/<!doctype html>\s*<html[^>]*>\s*<head>\s*/i, '')
  .replace(/<meta charset[^>]*>\s*<meta name="viewport"[^>]*>\s*/i, '')
  .replace(/<link rel="stylesheet" href="https:\/\/cdn\.jsdelivr\.net\/gh\/[^"]*">\s*/, '')
  .replace(/<\/head>\s*<body>\s*/i, '')
  .replace(/<\/body>\s*<\/html>\s*$/i, '')
  .replace('</style>', '.toolbar .pdf { display: none; }\n</style>');
writeFileSync(join(out, `${data.file}.artifact.html`), artifact);
console.log(join(out, `${data.file}.html`));
console.log(join(out, `${data.file}.artifact.html`));

// 인스타그램용 PNG: my site/카드뉴스/<이름>/<이름>-01.png … 슬라이드 수만큼 자동 저장
const pngDir = join(here, '..', '..', '..', '카드뉴스', data.file);
mkdirSync(pngDir, { recursive: true });
const { chromium } = await import('playwright');
const browser = await chromium.launch({ channel: 'msedge' });
try {
  const page = await browser.newPage({ viewport: { width: 1200, height: 1200 } });
  await page.goto(pathToFileURL(join(out, `${data.file}.html`)).href, { waitUntil: 'networkidle' });
  await page.evaluate(async () => {
    await document.fonts.ready;
    const grid = document.querySelector('.grid');
    grid.style.display = 'block'; grid.style.maxWidth = 'none'; grid.style.padding = '0';
    document.querySelector('.toolbar').style.display = 'none';
    document.querySelectorAll('.viewport').forEach((v) => { v.style.width = '1080px'; v.style.height = '1080px'; v.style.borderRadius = '0'; });
    document.querySelectorAll('.scaler').forEach((s) => { s.style.transform = 'none'; });
  });
  for (let i = 1; i <= data.slides.length; i++) {
    const dest = join(pngDir, `${data.file}-${String(i).padStart(2, '0')}.png`);
    await page.locator(`#slide-${i}`).screenshot({ path: dest });
    console.log(dest);
  }
} finally {
  await browser.close();
}
