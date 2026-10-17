// 영어 · 일본어 번역이 아직 없는 한국어 블로그 글을 최신순으로 보여 준다.
//
//   node scripts/translation-status.mjs        # 남은 글 목록
//   node scripts/translation-status.mjs --all  # 번역된 글까지 모두
//
// 번역 글은 src/content/blog/en/, ja/ 아래에 두고 frontmatter의 translationOf에 원문 slug를 적는다.
import fs from 'node:fs';
import path from 'node:path';

const BLOG = 'src/content/blog';
const field = (src, name) => src.match(new RegExp(`^${name}:\\s*"?(.*?)"?\\s*$`, 'm'))?.[1] ?? '';

const translated = { en: new Set(), ja: new Set() };
for (const lang of ['en', 'ja']) {
  const dir = path.join(BLOG, lang);
  if (!fs.existsSync(dir)) continue;
  for (const f of fs.readdirSync(dir).filter((f) => f.endsWith('.md'))) {
    translated[lang].add(field(fs.readFileSync(path.join(dir, f), 'utf8'), 'translationOf'));
  }
}

const posts = fs
  .readdirSync(BLOG)
  .filter((f) => f.endsWith('.md'))
  .map((f) => {
    const src = fs.readFileSync(path.join(BLOG, f), 'utf8');
    const slug = field(src, 'slug');
    return { file: f, slug, date: field(src, 'date'), chars: src.length, en: translated.en.has(slug), ja: translated.ja.has(slug) };
  })
  .sort((a, b) => b.date.localeCompare(a.date));

const all = process.argv.includes('--all');
const left = posts.filter((p) => !p.en || !p.ja);
for (const p of all ? posts : left) {
  console.log(`${p.en ? 'EN' : '--'} ${p.ja ? 'JA' : '--'}  ${p.date.slice(0, 10)}  ${String(p.chars).padStart(6)}자  ${p.file}`);
}
console.log(`\n번역 완료 ${posts.length - left.length}편 / 전체 ${posts.length}편, 남은 글 ${left.length}편`);
