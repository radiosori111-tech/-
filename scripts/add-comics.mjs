// scripts/comics/*.json의 4컷 콘티를 각 글의 frontmatter(comic:)에 넣는다.
//
//   node scripts/add-comics.mjs          # 아직 comic이 없는 글에만 넣기
//   node scripts/add-comics.mjs --force  # 이미 있는 comic도 JSON 내용으로 바꾸기
//
// JSON 형식: { "blog/<파일 이름>": { "title": "...", "panels": [[scene, 말풍선, 설명], × 4] } }
// 번역 글은 "blog/en/<파일 이름>", "articles/ja/<파일 이름>"처럼 언어 폴더를 붙인다.
// 컷 이름(문제 상황 → 원리 → 실천 → 변화)과 그림 설명(alt)은 언어에 맞춰 여기서 채운다.
import fs from 'node:fs';
import path from 'node:path';

const LABELS_BY_LANG = {
  ko: ['문제 상황', '원리', '실천', '변화'],
  en: ['The problem', 'How it works', 'What to do', 'The change'],
  ja: ['問題', 'しくみ', '実践', '変化'],
};
const SCENE_ALT_BY_LANG = {
  en: {
    alarm: 'A person breathing shallowly at a desk while an alarm bell rings overhead',
    tired: 'A tired person with a lowered head beside an almost empty battery',
    phone: 'A smartphone with notifications piling up',
    metronome: 'A metronome in the brainstem wired by a dashed line to an alarm speaker',
    synapse: 'Two neurons reaching out and connecting',
    sprout: 'A sprout growing from the top of a brain',
    clean: 'Waste draining out beneath the brain like drops of water',
    gut: 'The brain and the gut joined by a dotted line',
    shield: 'A shield with a check mark keeping germs away',
    glucose: 'A drop of blood and a glucose meter',
    loop: 'A loop from cue to action to reward',
    pause: 'A pause sign between an arrow for the trigger and the response',
    sigh: 'A breathing curve that climbs in two steps and falls in a long, gentle slope',
    run: 'A person running lightly with motion lines',
    lift: 'A person lifting a barbell',
    nature: 'A person walking beside a tree in the sunshine',
    sunrise: 'A rising sun and an eye taking in its light',
    sleep: 'A person asleep under a blanket beneath a crescent moon',
    food: 'A plate with meat, an egg, and greens, with a fork and knife',
    book: 'An open book and a pen',
    speech: 'A speech bubble coming from a person',
    focus: 'A light bulb glowing above a person deep in thought',
    steps: 'A staircase climbed step by step with a flag at the top',
    shoe: 'A running shoe with the curve of the foot arch beneath it',
    calm: 'A brain with an even wave and a slowly beating heart',
  },
  ja: {
    alarm: '机の前で浅く息をする人と、頭上で鳴る警報ベル',
    tired: 'うなだれた疲れた人と、ほとんど空になった電池',
    phone: '通知が次々にたまっていくスマートフォン',
    metronome: '脳幹のメトロノームが点線の配線で警報スピーカーとつながった図',
    synapse: '2つの神経細胞が枝を伸ばしてつながる瞬間',
    sprout: '脳の上から芽が出てくる図',
    clean: '脳の下から老廃物がしずくのように流れ出る図',
    gut: '脳と腸が点線でつながった図',
    shield: '細菌を防ぐ盾とチェックマーク',
    glucose: 'ひとしずくの血液と血糖測定器',
    loop: '合図から行動、報酬へとつながる輪',
    pause: '刺激を表す矢印と反応のあいだに置かれた一時停止マーク',
    sigh: '階段のように2段階で上がる吸気と、長くゆるやかに下がる呼気のグラフ',
    run: '軽やかに走る人と動きの線',
    lift: 'バーベルを持ち上げる人',
    nature: '日差しの下、木のそばを歩く人',
    sunrise: '昇る太陽と、その光を受ける目',
    sleep: '三日月の下で布団をかけて眠る人',
    food: '肉、卵、野菜がのった皿とフォーク、ナイフ',
    book: '開いた本とペン',
    speech: '人の口から出た吹き出し',
    focus: '考えにふける人の上で灯る電球',
    steps: '一段ずつ上る階段と、てっぺんの旗',
    shoe: 'ランニングシューズと、その下の足のアーチの曲線',
    calm: '穏やかな波が流れる脳と、ゆっくり打つ心臓',
  },
};
// 그림을 볼 수 없는 독자(화면 낭독기)를 위한 그림 설명
const SCENE_ALT_KO = {
  alarm: '책상 앞에서 짧게 숨 쉬는 사람과 머리 위에서 울리는 경보 종',
  tired: '지쳐 고개를 떨군 사람과 거의 바닥난 배터리',
  phone: '알림이 쉬지 않고 쌓이는 스마트폰',
  metronome: '뇌간의 메트로놈이 점선 배선으로 경보 스피커와 이어진 그림',
  synapse: '두 신경세포가 가지를 뻗어 서로 이어지는 순간',
  sprout: '뇌 위로 새싹이 돋아나는 그림',
  clean: '뇌 아래로 노폐물이 물방울처럼 빠져나가는 그림',
  gut: '뇌와 장이 점선으로 이어진 그림',
  shield: '세균을 막아 내는 방패와 체크 표시',
  glucose: '혈액 한 방울과 혈당 측정기',
  loop: '신호에서 행동, 보상으로 이어지는 둥근 고리',
  pause: '자극을 뜻하는 화살표와 반응 사이에 놓인 멈춤 표시',
  sigh: '두 번 계단처럼 오르는 들숨과 길게 내려가는 날숨 그래프',
  run: '가볍게 달리는 사람과 움직임 선',
  lift: '바벨을 들어 올리는 사람',
  nature: '햇살 아래 나무 옆을 걷는 사람',
  sunrise: '떠오르는 해와 그 빛을 받는 눈',
  sleep: '초승달 아래 이불을 덮고 잠든 사람',
  food: '접시에 담긴 고기, 달걀, 채소와 포크, 나이프',
  book: '펼친 책과 펜',
  speech: '사람의 입에서 나온 말풍선',
  focus: '생각에 잠긴 사람 위로 켜진 전구',
  steps: '한 칸씩 오르는 계단 꼭대기의 깃발',
  shoe: '러닝화와 그 아래 발 아치 곡선',
  calm: '고른 파형이 흐르는 뇌와 천천히 뛰는 심장',
};

const force = process.argv.includes('--force');
const dir = path.resolve('scripts/comics');
const data = Object.assign({}, ...fs.readdirSync(dir).filter((f) => f.endsWith('.json')).map((f) => JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'))));

const q = (s) => JSON.stringify(s);
let added = 0;
for (const [key, comic] of Object.entries(data)) {
  const file = path.resolve('src/content', `${key}.md`);
  if (!fs.existsSync(file)) { console.log(`✗ 파일 없음: ${key}`); continue; }
  if (comic.panels.length !== 4) { console.log(`✗ 컷이 4개가 아님: ${key}`); continue; }
  const src = fs.readFileSync(file, 'utf8');
  const m = src.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  if (!m) { console.log(`✗ frontmatter 없음: ${key}`); continue; }
  let front = m[1];
  if (/^comic:/m.test(front)) {
    if (!force) continue;
    front = front.replace(/^comic:[\s\S]*?(?=^\S|(?![\s\S]))/m, '').trimEnd();
  }
  const lang = ['en', 'ja'].includes(key.split('/')[1]) ? key.split('/')[1] : 'ko';
  const LABELS = LABELS_BY_LANG[lang];
  const SCENE_ALT = lang === 'ko' ? SCENE_ALT_KO : SCENE_ALT_BY_LANG[lang];
  const yaml = [
    'comic:',
    `  title: ${q(comic.title)}`,
    '  panels:',
    ...comic.panels.flatMap(([scene, bubble, caption], i) => [
      `    - scene: ${scene}`,
      `      label: ${q(LABELS[i])}`,
      `      bubble: ${q(bubble)}`,
      `      alt: ${q(SCENE_ALT[scene])}`,
      `      caption: ${q(caption)}`,
    ]),
  ].join('\n');
  fs.writeFileSync(file, `---\n${front}\n${yaml}\n---\n${src.slice(m[0].length)}`, 'utf8');
  added++;
}
console.log(`4컷 만화를 넣은 글: ${added}편 (콘티 ${Object.keys(data).length}편)`);
