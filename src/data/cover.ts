// 사진이 없는 블로그 글의 표지. slug로 별자리와 색이, 제목·설명·태그의 주제어로 그림이 정해진다
const hash = (s: string) => { let h = 2166136261; for (const ch of s) { h ^= ch.codePointAt(0)!; h = Math.imul(h, 16777619); } return h >>> 0; };
const PALETTES = [
  ['#7c5cff', '#2dd4bf', '#0b0a24', '#101a33'],
  ['#2dd4bf', '#7dd3fc', '#061620', '#0b1a2e'],
  ['#c084fc', '#f472b6', '#140a26', '#1a1030'],
  ['#5fd0c0', '#fde68a', '#08121c', '#141a2c'],
];
const MOTIFS: [string, RegExp][] = [
  ['sun', /햇볕|햇빛|아침|빛|생체리듬|일찍|sun|light|morning|朝|光/i],
  ['breath', /숨|호흡|명상|불안|breath|meditat|呼吸|瞑想/i],
  ['walk', /걷|산책|러닝|뛰|운동|HIIE|walk|run|exercise|歩|走|運動/i],
  ['shield', /치매|면역|회복탄력성|PLA2G2F|비상|dementia|resilien|認知症|回復力/i],
  ['speech', /말|말버릇|감정|word|speech|言葉|口癖/i],
  ['book', /기억|기록|관찰|memory|record|記憶|記録/i],
  ['leaf', /음식|식단|카니보어|단식|식사|마사지|food|diet|carnivore|fast|食/i],
  ['molecule', /BDNF|마그네슘|인슐린|케톤|브레인포그|magnesium|insulin|keton/i],
];
const BRAIN = 'M120 250C95 175 150 92 235 72C305 50 385 52 445 86C515 122 548 195 525 255C508 300 465 322 425 318C402 345 362 352 332 336C300 356 250 350 225 326C178 332 134 300 120 250Z';
const art: Record<string, string> = {
  brain: `<g transform="translate(400 250) scale(.62) translate(-330 -210)"><path d="${BRAIN}"/><path d="M338 56C326 92 344 120 322 152C304 180 318 208 300 240M196 258C250 238 300 236 350 222C372 216 392 220 410 212M250 80C238 112 260 138 236 170M410 92C396 124 420 150 400 182" opacity=".5"/></g>`,
  sun: `<circle cx="400" cy="250" r="54"/><circle cx="400" cy="250" r="30" opacity=".5"/>${[...Array(12)].map((_, i) => { const a = i * Math.PI / 6, r1 = 78, r2 = i % 2 ? 104 : 120; return `<path d="M${(400 + Math.cos(a) * r1).toFixed(1)} ${(250 + Math.sin(a) * r1).toFixed(1)}L${(400 + Math.cos(a) * r2).toFixed(1)} ${(250 + Math.sin(a) * r2).toFixed(1)}"/>`; }).join('')}`,
  breath: [0, 1, 2, 3].map((i) => `<path d="M220 ${210 + i * 26}C280 ${170 + i * 26} 340 ${250 + i * 26} 400 ${210 + i * 26}S520 ${170 + i * 26} 580 ${210 + i * 26}" opacity="${1 - i * .2}"/>`).join('') + `<circle cx="400" cy="250" r="118" opacity=".35"/>`,
  walk: `<path d="M230 360C300 360 300 290 370 280S470 250 480 190S540 130 570 130"/>${[[262,350],[310,326],[352,290],[405,276],[452,240],[485,186],[530,140]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="6"/>`).join('')}<circle cx="570" cy="130" r="14"/>`,
  leaf: `<path d="M300 340C290 230 370 150 510 150C520 280 430 350 300 340Z"/><path d="M300 340C360 280 420 220 480 180M360 286L350 230M400 246L420 196M440 214L470 216M380 266L430 270"/>`,
  molecule: (() => { const pts = [...Array(6)].map((_, i) => [400 + Math.cos(i * Math.PI / 3 + Math.PI / 6) * 70, 250 + Math.sin(i * Math.PI / 3 + Math.PI / 6) * 70]); const out = [[400, 110], [535, 330], [265, 330]]; return `<path d="M${pts.map((p) => p.map((v) => v.toFixed(1)).join(' ')).join('L')}Z"/><path d="M400 180L400 110M460.6 285L535 330M339.4 285L265 330"/>${[...pts, ...out].map(([x, y]) => `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="8"/>`).join('')}`; })(),
  speech: `<path d="M260 170h230a30 30 0 0 1 30 30v90a30 30 0 0 1-30 30H350l-50 40v-40h-40a30 30 0 0 1-30-30v-90a30 30 0 0 1 30-30Z"/><path d="M300 245C330 215 350 275 380 245S430 215 460 245" opacity=".7"/><path d="M548 200C566 220 566 270 548 290M576 180C604 214 604 276 576 310" opacity=".6"/>`,
  shield: `<path d="M400 120L510 160V250C510 315 460 360 400 382C340 360 290 315 290 250V160Z"/><path d="M350 250L390 290L460 210"/>`,
  book: `<path d="M400 180C360 150 300 145 240 160V350C300 335 360 340 400 370C440 340 500 335 560 350V160C500 145 440 150 400 180Z"/><path d="M400 180V370"/><path d="M280 210C310 204 340 206 370 216M280 250C310 244 340 246 370 256M430 216C460 206 490 204 520 210M430 256C460 246 490 244 520 250" opacity=".55"/>`,
};
export function cover(slug: string, text = ""): string {
  let seed = hash(slug) || 1;
  const rnd = () => ((seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0) / 4294967296);
  const [c1, c2, b1, b2] = PALETTES[hash(slug + '#') % PALETTES.length];
  const motif = (MOTIFS.find(([, re]) => re.test(text)) ?? ['brain'])[0];
  const id = 'c' + hash(slug).toString(36);
  const stars = [...Array(70)].map(() => `<circle cx="${(rnd() * 800).toFixed(0)}" cy="${(rnd() * 500).toFixed(0)}" r="${(0.4 + rnd() * 1.3).toFixed(1)}" opacity="${(0.3 + rnd() * 0.7).toFixed(2)}"/>`).join('');
  const nodes = [...Array(9)].map(() => [40 + rnd() * 720, 30 + rnd() * 440]);
  const net = nodes.slice(1).map((p, i) => `M${nodes[i].map((v) => v.toFixed(0)).join(' ')}L${p.map((v) => v.toFixed(0)).join(' ')}`).join('');
  const glow = nodes.map(([x, y], i) => `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${i % 3 ? 14 : 24}" fill="url(#${id}h)"/><circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="1.8" fill="#f4fbff"/>`).join('');
  const m = art[motif];
  return `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" role="presentation"><defs><linearGradient id="${id}b" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${b1}"/><stop offset="1" stop-color="${b2}"/></linearGradient><radialGradient id="${id}n" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="${c1}" stop-opacity=".55"/><stop offset=".6" stop-color="${c2}" stop-opacity=".12"/><stop offset="1" stop-color="${c2}" stop-opacity="0"/></radialGradient><radialGradient id="${id}h"><stop offset="0" stop-color="${c2}" stop-opacity=".7"/><stop offset="1" stop-color="${c2}" stop-opacity="0"/></radialGradient><linearGradient id="${id}s" x1="0" x2="1"><stop offset="0" stop-color="${c2}"/><stop offset="1" stop-color="${c1}"/></linearGradient></defs><rect width="800" height="500" fill="url(#${id}b)"/><ellipse cx="400" cy="250" rx="380" ry="260" fill="url(#${id}n)"/><g fill="#ffffff">${stars}</g><path d="${net}" fill="none" stroke="#c7d2fe" stroke-opacity=".14"/>${glow}<g fill="none" stroke="${c2}" stroke-opacity=".22" stroke-width="14" stroke-linecap="round" stroke-linejoin="round">${m}</g><g fill="none" stroke="url(#${id}s)" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round">${m}</g></svg>`;
}
