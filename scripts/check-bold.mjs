// 마크다운의 **굵게**가 깨질 자리(닫는 ** 앞이 문장부호이고 바로 뒤에 글자가 붙는 곳)를 찾아 <strong>으로 바꾼다.
// 한국어 · 일본어는 조사가 바로 붙어서 이런 자리가 자주 생긴다.
//
//   node scripts/check-bold.mjs <파일 또는 폴더>...   # 고치기
//   node scripts/check-bold.mjs --dry <…>            # 보기만
import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const dry = args.includes('--dry');
const files = args.filter((a) => a !== '--dry').flatMap((p) =>
  fs.statSync(p).isDirectory() ? fs.readdirSync(p).filter((f) => f.endsWith('.md')).map((f) => path.join(p, f)) : [p],
);

// **…** 쌍을 앞에서부터 차례로 보고, 닫는 ** 앞이 문장부호(괄호 · 따옴표 · 마침표 등)인데
// 바로 뒤에 공백이나 문장부호가 아닌 글자가 붙어 있으면 강조가 깨지는 자리다
const PAIR = /\*\*([^*\n]+?)\*\*/g;
const ENDS_IN_PUNCT = /[)\]）」』"'’”.。、,，!?！？:：]$/;
// 바로 뒤에 ** 가 또 붙는 경우(**가：****나**)도 깨지므로 *는 안전한 글자로 보지 않는다
const SAFE_NEXT = /^[\s.,!?)\]）」』、。:;]?$/;

function fix(src) {
  let n = 0;
  const out = src.replace(PAIR, (whole, t, offset, all) => {
    const next = all[offset + whole.length] ?? '';
    if (ENDS_IN_PUNCT.test(t) && !SAFE_NEXT.test(next)) {
      n++;
      return `<strong>${t}</strong>`;
    }
    return whole;
  });
  return { out, n };
}

let total = 0;
for (const f of files) {
  const src = fs.readFileSync(f, 'utf8');
  const { out, n } = fix(src);
  total += n;
  if (n) {
    console.log(`${path.basename(f)}: ${n}곳`);
    if (!dry) fs.writeFileSync(f, out, 'utf8');
  }
}
console.log(`${dry ? '고칠 곳' : '고친 곳'}: ${total}`);
