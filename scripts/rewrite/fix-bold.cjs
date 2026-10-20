// **…)**가 처럼 구두점으로 끝난 굵은 글씨 바로 뒤에 글자가 붙으면 마크다운이 굵게 처리하지 못한다.
// 그런 경우만 <strong>…</strong>으로 바꾼다 (본문만, 프런트매터 제외)
const fs = require('fs');
const path = require('path');
const root = process.argv[2];
const P = /[\p{P}\p{S}]/u;
const W = /[^\s\p{P}\p{S}]/u;
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) =>
  e.isDirectory() ? walk(path.join(d, e.name)) : /\.mdx?$/.test(e.name) ? [path.join(d, e.name)] : []);
let total = 0;
for (const f of walk(root)) {
  const src = fs.readFileSync(f, 'utf8');
  const m = src.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n/);
  const head = m ? m[0] : '';
  let n = 0;
  const body = src.slice(head.length).replace(/\*\*([^*\n]+?)\*\*/g, (all, inner, off, s) => {
    const before = s[off - 1] || ' ';
    const after = s[off + all.length] || ' ';
    const badClose = P.test(inner.at(-1)) && W.test(after);
    const badOpen = P.test(inner[0]) && W.test(before);
    if (!badClose && !badOpen) return all;
    n++;
    return `<strong>${inner}</strong>`;
  });
  if (n) { fs.writeFileSync(f, head + body); total += n; console.log(n, path.relative(root, f)); }
}
console.log('total', total);
