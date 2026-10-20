// 카드뉴스 데이터(JSON)를 템플릿에 넣어 두 파일을 만든다
//  exports/cardnews/<이름>.html          내 컴퓨터에서 열어 PNG·PDF로 저장하는 파일
//  exports/cardnews/<이름>.artifact.html 팝업(Artifact)으로 미리 보는 파일 (PNG는 downloads 기능으로 저장, PDF 버튼 없음, 허용된 글꼴만)
// 사용: node scripts/cardnews/build.mjs scripts/cardnews/data/<이름>.json
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const src = process.argv[2];
if (!src) throw new Error('데이터 파일 경로를 넣어 주세요');
const data = JSON.parse(readFileSync(src, 'utf8'));
data.file ??= basename(src, '.json');
const tpl = readFileSync(join(here, 'template.html'), 'utf8');
const out = join(here, '..', '..', 'exports', 'cardnews');
mkdirSync(out, { recursive: true });

const esc = (s) => s.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
const page = tpl
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
