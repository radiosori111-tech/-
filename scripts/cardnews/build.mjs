// 카드뉴스 데이터(JSON)를 템플릿에 넣어 exports/cardnews/<이름>.html을 만든다
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
const dest = join(out, `${data.file}.html`);
writeFileSync(dest, tpl.replace('/*DATA*/null', JSON.stringify(data).replace(/</g, '\\u003c')));
console.log(dest);
