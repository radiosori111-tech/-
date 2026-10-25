// 빌드된 페이지(dist)에서, 같은 페이지 안으로 가는 링크(href="#이름")마다 그 이름을 가진 자리(id="이름")가 있는지 확인한다.
// 글 안 "바로 가기 ↓" 링크가 아무 데도 닿지 않으면 빌드를 실패시켜 배포 전에 잡는다.
//
//   node scripts/check-anchors.mjs            # dist 전체 검사 (npm run build 끝에 자동 실행)
//   node scripts/check-anchors.mjs dist/blog  # 일부 폴더만
import fs from 'node:fs';
import path from 'node:path';

const roots = process.argv.slice(2);
if (roots.length === 0) roots.push('dist');

const htmlFiles = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? htmlFiles(p) : e.name.endsWith('.html') ? [p] : [];
  });

// href·id 값은 &amp; 같은 문자 참조나 %인코딩으로 들어올 수 있어 같은 모양으로 풀어서 비교한다
const decode = (s) => {
  const t = s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'");
  try { return decodeURIComponent(t); } catch { return t; }
};

const problems = [];
let checked = 0;
for (const root of roots) {
  for (const file of htmlFiles(root)) {
    const html = fs.readFileSync(file, 'utf8');
    const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => decode(m[1])));
    // name="…" 로 표시한 옛 방식의 자리도 인정한다
    for (const m of html.matchAll(/<a\s[^>]*name="([^"]+)"/g)) ids.add(decode(m[1]));
    for (const m of html.matchAll(/href="#([^"]*)"/g)) {
      const target = decode(m[1]);
      // href="#" 와 맨 위로(#top)는 페이지 자체가 목적지이므로 통과
      if (target === '' || target === 'top') continue;
      checked++;
      if (!ids.has(target)) problems.push(`${path.relative(process.cwd(), file)}  →  #${target}`);
    }
  }
}

if (problems.length) {
  console.error(`\n[check-anchors] 닿는 자리가 없는 페이지 안 링크 ${problems.length}개:`);
  for (const p of [...new Set(problems)]) console.error('  ' + p);
  console.error('\n글에 <span id="이름" class="jump-target"></span>을 두거나 링크의 #이름을 고쳐 주세요.\n');
  process.exit(1);
}
console.log(`[check-anchors] 페이지 안 링크 ${checked}개 모두 닿는 자리가 있습니다.`);
