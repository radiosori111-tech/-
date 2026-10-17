// 글 본문의 핵심 용어(뇌 부위 · 신경전달물질 · 핵심 기전 · 학술지명)를 진한 글씨로 만든다.
//
//   node scripts/bold-terms.mjs            # 한국어 블로그 글 + 아티클 전체
//   node scripts/bold-terms.mjs --dry      # 바꾸지 않고 몇 곳이 바뀔지만 보기
//   node scripts/bold-terms.mjs 파일.md …   # 지정한 파일만
//
// - 소제목(##)으로 나뉜 절마다 용어의 첫 등장만 굵게 한다. 이미 굵은 곳이 있으면 그 절에서는 건너뛴다.
// - 소제목 줄, 이미지, 링크, 인라인 코드, 기울임(*…*), HTML 블록(도해 등), 참고 문헌 절은 건드리지 않는다.
// - 티스토리에서 글자 그대로 옮겨 온 \*\*…\*\* 표시는 진한 글씨로 바꾼다.
// - 굵게 하는 범위가 문장부호로 끝나 조사와 붙으면 마크다운 강조가 깨지므로, 그때는 <strong>을 쓴다.
import fs from 'node:fs';
import path from 'node:path';

const TERMS = [
  // 뇌 부위 · 신경 구조
  '전전두피질', '전전두엽', '전두엽', '전대상피질', '대상피질', '해마', '편도체', '청반점', '청반', '뇌간',
  '시상하부', '시교차상핵', '소뇌', '측좌핵', '선조체', '기저핵', '섬엽', '뇌하수체', '송과선', '복측피개영역',
  '흑질', '미주신경', '신경아교세포', '미세아교세포', '별아교세포', '프리뵈칭거 복합체', '지주막하',
  // 신경전달물질 · 호르몬 · 분자
  '노르에피네프린', '노르아드레날린', '아드레날린', '도파민', '세로토닌', '아세틸콜린', '엔도르핀', '옥시토신',
  '코르티솔', '멜라토닌', '아데노신', '글루탐산', 'GABA', 'BDNF', 'IGF-1', '케톤체', '베타 아밀로이드', '아밀로이드',
  // 핵심 기전
  '신경가소성', '뇌가소성', '글림프 시스템', '글림프계', '일주기 리듬', '생체시계', '수면관성', '심박 변이도',
  '호흡성 동성 부정맥', '도파민 보상 회로', '보상 회로', '보상 예측 오차',
  // 학술지
  'Nature Reviews Neuroscience', 'Nature Neuroscience', 'Nature Communications', 'Nature Medicine', 'Nature',
  'Cell Reports Medicine', 'Cell Metabolism', 'Cell', 'Science Translational Medicine', 'Science Advances', 'Science',
  'Neuron', 'Journal of Neuroscience', 'J Neurosci', 'PNAS', 'The Lancet', 'Lancet', 'JAMA', 'NEJM',
  'New England Journal of Medicine', 'eLife', 'Current Biology', 'Psychological Science', 'Sleep Medicine Reviews',
];

// '해마다'(매년)처럼 용어가 다른 낱말의 일부인 경우를 거른다
const NOT_FOLLOWED_BY = { 해마: '다', 시상하부: '' };
const isLatin = (s) => /^[A-Za-z]/.test(s);
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const sorted = [...TERMS].sort((a, b) => b.length - a.length);
const termRe = new RegExp(
  sorted
    .map((t) => {
      let p = esc(t);
      if (isLatin(t)) p = `(?<![A-Za-z])${p}(?![A-Za-z])`;
      if (NOT_FOLLOWED_BY[t]) p += `(?!${NOT_FOLLOWED_BY[t]})`;
      return p;
    })
    .join('|'),
  'g',
);

// 건드리지 않을 조각: 굵은 글씨, HTML 태그, 이미지 · 링크, 코드, 기울임, 주소
const PROTECT = /(<strong>[\s\S]*?<\/strong>|\*\*[^*\n]+?\*\*|<[^>]+>|!?\[[^\]]*\]\([^)]*\)|`[^`]*`|(?<![*\w])\*[^*\n]+?\*(?![*\w])|https?:\/\/\S+)/g;
const REFERENCES = /^#{2,3}\s*(참고\s*문헌|출처|References|参考文献)/;

function processBody(body) {
  let seen = new Set();
  let inHtml = '';
  let inRefs = false;
  let count = 0;
  const lines = body.split('\n').map((line) => {
    // 티스토리에서 그대로 옮겨진 \*\*굵게\*\* 표시
    line = line.replace(/\\\*\\\*(.+?)\\\*\\\*/g, (_, t) => { count++; return `<strong>${t.trim()}</strong>`; });

    const trimmed = line.trim();
    if (/^#{1,2}\s/.test(trimmed)) { seen = new Set(); inRefs = REFERENCES.test(trimmed); return line; }
    if (/^#{3,6}\s/.test(trimmed)) { if (REFERENCES.test(trimmed)) inRefs = true; return line; }
    if (inRefs) return line;
    // 열린 HTML 블록은 같은 태그가 닫힐 때까지 건너뛴다 (도해 figure 안의 </svg>에서 끝나지 않도록)
    if (inHtml) { if (trimmed.includes(`</${inHtml}>`)) inHtml = ''; return line; }
    const open = trimmed.match(/^<(figure|div|table|svg)\b/);
    if (open) { if (!trimmed.includes(`</${open[1]}>`)) inHtml = open[1]; return line; }
    if (!trimmed || trimmed.startsWith('![') || /^\|?\s*-{3,}/.test(trimmed)) return line;

    // 이미 굵게 쓴 용어는 이 절에서 다시 굵게 하지 않는다
    for (const m of line.matchAll(/<strong>([\s\S]*?)<\/strong>|\*\*([^*\n]+?)\*\*/g)) {
      for (const t of (m[1] ?? m[2]).matchAll(termRe)) seen.add(t[0]);
    }
    return line
      .split(PROTECT)
      .map((part, i) => {
        if (i % 2 === 1) return part;
        return part.replace(termRe, (term, offset, whole) => {
          if (seen.has(term)) return term;
          seen.add(term);
          count++;
          const next = whole[offset + term.length] ?? '';
          // 용어가 문장부호로 끝나고 바로 글자가 이어지면 ** 대신 <strong>
          return /[)\]'"’”.]$/.test(term) && /[^\s.,!?)]/.test(next) ? `<strong>${term}</strong>` : `**${term}**`;
        });
      })
      .join('');
  });
  return { body: lines.join('\n'), count };
}

const args = process.argv.slice(2);
const dry = args.includes('--dry');
const files = args.filter((a) => a.endsWith('.md'));
const targets = files.length
  ? files
  : [
      ...fs.readdirSync('src/content/blog').filter((f) => f.endsWith('.md')).map((f) => path.join('src/content/blog', f)),
      ...fs.readdirSync('src/content/articles').filter((f) => f.endsWith('.md')).map((f) => path.join('src/content/articles', f)),
    ];

let total = 0;
for (const file of targets) {
  const src = fs.readFileSync(file, 'utf8');
  const m = src.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n/);
  const front = m ? m[0] : '';
  const { body, count } = processBody(src.slice(front.length));
  if (!count) continue;
  total += count;
  console.log(`${String(count).padStart(3)}  ${path.basename(file)}`);
  if (!dry) fs.writeFileSync(file, front + body, 'utf8');
}
console.log(`\n${dry ? '바꿀 곳' : '바꾼 곳'}: ${total}`);
