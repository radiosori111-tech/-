// 지식 네트워크: 글을 이어 주는 뇌과학 개념 11개와 그 사이의 연결.
// 글의 제목 · 설명 · 태그에서 개념을 찾아(아래 match) 글 아래에 개념 사슬로 보여 주고, 개념마다 모아 보기 페이지를 만든다.
import type { Lang } from '../i18n/ui';
import { getPosts, postUrl, postTags, postMinutes, type Post } from './blog';
import { getArticles, articleUrl, type Article } from './articles';

export interface Concept {
  id: string;
  name: Record<Lang, string>;
  blurb: Record<Lang, string>;
  match: RegExp;
  // 전체 지도에서의 자리 (viewBox 640×300)
  x: number;
  y: number;
}

export const CONCEPTS: Concept[] = [
  {
    id: 'exercise', x: 90, y: 80,
    name: { ko: '운동', en: 'Exercise', ja: '運動' },
    blurb: {
      ko: '걷기, 달리기, 근력 운동처럼 몸을 움직이는 일은 뇌로 가는 혈류와 신경영양인자를 늘려 뇌가 바뀔 바탕을 만듭니다.',
      en: 'Walking, running and strength training raise blood flow and growth factors in the brain, laying the ground for it to change.',
      ja: '歩く、走る、筋トレのように体を動かすことは、脳への血流と神経栄養因子を増やし、脳が変わる土台をつくります。',
    },
    match: /운동|걷기|걷는|산책|러닝|러너|뛰|달리|HIIE|근력|exercise|walk|running|runner|workout|strength|運動|歩|ランニング|筋トレ/i,
  },
  {
    id: 'nutrition', x: 90, y: 220,
    name: { ko: '식단 · 대사', en: 'Diet & metabolism', ja: '食事・代謝' },
    blurb: {
      ko: '무엇을 언제 먹는지는 혈당과 인슐린, 케톤 같은 연료를 통해 뇌의 에너지와 집중에 영향을 줍니다.',
      en: 'What and when we eat shapes the brain’s fuel, through blood sugar, insulin and ketones, and with it energy and focus.',
      ja: '何をいつ食べるかは、血糖やインスリン、ケトンといった燃料を通して脳のエネルギーと集中に影響します。',
    },
    match: /식단|음식|식사|단식|카니보어|인슐린|혈당|케톤|마그네슘|다이어트|food|diet|fasting|carnivore|insulin|blood sugar|ketone|magnesium|食事|食べ物|断食|カーニボア|インスリン|血糖|ケトン|マグネシウム|ダイエット/i,
  },
  {
    id: 'sleep', x: 390, y: 262,
    name: { ko: '수면 · 생체리듬', en: 'Sleep & rhythm', ja: '睡眠・リズム' },
    blurb: {
      ko: '아침빛으로 맞춰지는 생체시계와 밤의 깊은 잠은 낮에 배운 것을 정리하고 다음 날의 집중을 준비합니다.',
      en: 'A body clock set by morning light and deep sleep at night sort out what we learned and prepare tomorrow’s focus.',
      ja: '朝の光で合わせる体内時計と夜の深い眠りが、昼に学んだことを整理し、翌日の集中を整えます。',
    },
    match: /수면|잠|생체|햇빛|햇볕|아침|일찍|sleep|circadian|sunlight|daylight|morning|睡眠|眠|体内時計|朝|日光/i,
  },
  {
    id: 'emotion', x: 240, y: 40,
    name: { ko: '감정 · 스트레스', en: 'Emotion & stress', ja: '感情・ストレス' },
    blurb: {
      ko: '불안과 스트레스는 호흡, 운동, 생각과 거리 두기 같은 연습으로 다룰 수 있고, 회복탄력성도 훈련으로 자랍니다.',
      en: 'Anxiety and stress can be worked with through breathing, exercise and stepping back from thoughts, and resilience grows with practice.',
      ja: '不安やストレスは、呼吸や運動、思考と距離をとる練習で扱うことができ、レジリエンスも練習で育ちます。',
    },
    match: /불안|감정|스트레스|번아웃|호흡|숨|ACT|회복탄력성|anxiety|stress|emotion|burnout|breath|resilien|不安|感情|ストレス|燃え尽き|呼吸|レジリエンス/i,
  },
  {
    id: 'habit', x: 390, y: 40,
    name: { ko: '습관 · 의지', en: 'Habits & willpower', ja: '習慣・意志' },
    blurb: {
      ko: '새 행동은 처음엔 전전두엽이 애써 붙잡고, 반복될수록 기저핵이 맡아 저절로 굴러가게 됩니다.',
      en: 'A new behavior is held in place by the prefrontal cortex at first; with repetition the basal ganglia take over and it runs on its own.',
      ja: '新しい行動は最初は前頭前野ががんばって支え、くり返すうちに大脳基底核が引き継いで自然に回るようになります。',
    },
    match: /습관|작심삼일|의지|aMCC|목표|확언|말버릇|몰입|관찰|생각하는 방식|habit|willpower|goal|affirmation|immersi|observ|flow|習慣|三日坊主|意志|目標|アファメーション|口癖|没入|観察/i,
  },
  {
    id: 'neurotransmitter', x: 535, y: 70,
    name: { ko: '신경전달물질', en: 'Neurotransmitters', ja: '神経伝達物質' },
    blurb: {
      ko: '도파민 같은 신경전달물질은 보상을 예측하고 행동을 고르는 신호를 실어 나르며, 습관의 고리를 만듭니다.',
      en: 'Neurotransmitters such as dopamine carry the signals that predict rewards and steer choices, forming the loop of a habit.',
      ja: 'ドーパミンなどの神経伝達物質は、報酬を予測し行動を選ぶ信号を運び、習慣のループをつくります。',
    },
    match: /도파민|세로토닌|신경전달|보상|플라시보|dopamine|serotonin|neurotransmitter|reward|placebo|ドーパミン|セロトニン|神経伝達|報酬|プラセボ/i,
  },
  {
    id: 'bdnf', x: 240, y: 150,
    name: { ko: 'BDNF', en: 'BDNF', ja: 'BDNF' },
    blurb: {
      ko: '뇌 유래 신경영양인자(BDNF)는 신경세포가 자라고 연결을 맺도록 돕는 뇌의 비료로, 운동과 식사, 잠의 영향을 받습니다.',
      en: 'Brain-derived neurotrophic factor (BDNF) is the brain’s fertilizer, helping neurons grow and connect, and it responds to exercise, food and sleep.',
      ja: '脳由来神経栄養因子(BDNF)は、神経細胞が育ちつながるのを助ける脳の肥料で、運動・食事・睡眠の影響を受けます。',
    },
    match: /BDNF|신경영양|neurotrophic|神経栄養/i,
  },
  {
    id: 'immunity', x: 240, y: 268,
    name: { ko: '뇌 면역 · 장-뇌 축', en: 'Brain immunity & gut', ja: '脳の免疫・腸脳相関' },
    blurb: {
      ko: '뇌 속 면역세포와 노폐물이 빠져나가는 길, 장과 뇌를 잇는 신호는 맑은 머리와 기억을 지키는 데 함께 일합니다.',
      en: 'The brain’s immune cells, its waste-clearing routes and the signals linking gut and brain work together to keep the mind clear and memory safe.',
      ja: '脳の免疫細胞や老廃物の出口、腸と脳をつなぐ信号は、すっきりした頭と記憶を守るためにいっしょに働きます。',
    },
    match: /면역|장-뇌|IgA|림프|치매|신경아교|immune|gut|lymph|dementia|glia|免疫|腸|リンパ|認知症|グリア/i,
  },
  {
    id: 'synapse', x: 390, y: 150,
    name: { ko: '시냅스 · 가소성', en: 'Synapses & plasticity', ja: 'シナプス・可塑性' },
    blurb: {
      ko: '함께 쓰이는 신경 연결은 강해지고 쓰지 않는 연결은 약해집니다. 뇌가 평생 바뀔 수 있는 이유인 신경가소성입니다.',
      en: 'Connections used together grow stronger and unused ones fade. This is neuroplasticity, the reason the brain can change throughout life.',
      ja: 'いっしょに使われる神経のつながりは強まり、使われないつながりは弱まります。脳が一生変わりうる理由、神経可塑性です。',
    },
    match: /가소성|시냅스|신경 ?회로|헵|뇌가 변|뇌가 바뀌|plasticity|synap|rewire|circuit|可塑性|シナプス|回路|脳が変/i,
  },
  {
    id: 'memory', x: 540, y: 205,
    name: { ko: '기억 · 해마', en: 'Memory & hippocampus', ja: '記憶・海馬' },
    blurb: {
      ko: '해마는 새 기억을 만들고 잠자는 동안 대뇌피질로 옮겨 오래 남깁니다. 운동과 잠, 기록이 해마를 돕습니다.',
      en: 'The hippocampus forms new memories and, during sleep, hands them to the cortex to keep. Exercise, sleep and writing things down all help it.',
      ja: '海馬は新しい記憶をつくり、眠っているあいだに大脳皮質へ移して長く残します。運動と睡眠、記録が海馬を助けます。',
    },
    match: /기억|해마|학습|기록|memory|hippocamp|learning|record|記憶|海馬|学習|記録/i,
  },
  {
    id: 'social', x: 600, y: 140,
    name: { ko: '관계 · 공감', en: 'Relationships & empathy', ja: '人間関係・共感' },
    blurb: {
      ko: '남의 아픔을 내 아픔처럼 느끼는 공감 회로와, 베풀 때 켜지는 보상 회로는 협력과 나눔이 결국 나에게 돌아오게 만듭니다.',
      en: 'Empathy circuits that feel another’s pain as our own, and reward circuits that light up when we give, make cooperation and generosity come back to us.',
      ja: '他人の痛みを自分の痛みのように感じる共感の回路と、与えるときに働く報酬回路が、協力と分かち合いを自分に返ってくるものにします。',
    },
    match: /이타|공감|베풂|베풀|베푼|나눔|기부|협력|친절|이기적 유전자|팃포탯|altruis|empath|generos|giving|cooperat|kindness|selfish gene|tit for tat|利他|共感|分かち合|寄付|協力|親切|利己的な遺伝子|しっぺ返し/i,
  },
];

// 개념 사이의 연결 (전체 지도의 선)
export const LINKS: [string, string][] = [
  ['exercise', 'bdnf'], ['exercise', 'emotion'], ['nutrition', 'bdnf'], ['nutrition', 'immunity'],
  ['emotion', 'habit'], ['habit', 'neurotransmitter'], ['habit', 'synapse'], ['neurotransmitter', 'synapse'],
  ['bdnf', 'synapse'], ['synapse', 'memory'], ['sleep', 'memory'], ['sleep', 'synapse'], ['immunity', 'memory'],
  ['social', 'emotion'], ['social', 'neurotransmitter'],
];

// 사슬은 원인 → 원리 → 결과 순서로 읽히게 놓는다
const ORDER = ['exercise', 'nutrition', 'sleep', 'emotion', 'social', 'habit', 'neurotransmitter', 'bdnf', 'immunity', 'synapse', 'memory'];

export const conceptById = (id: string) => CONCEPTS.find((c) => c.id === id)!;
export const conceptPath = (lang: Lang, id?: string) => `${lang === 'ko' ? '' : `/${lang}`}/concepts/${id ? `${id}/` : ''}`;
export const neighbors = (id: string) => LINKS.flatMap(([a, b]) => (a === id ? [b] : b === id ? [a] : []));

// 글의 개념: 제목은 두 번 세어 무게를 더 주고, 많이 걸린 순서로 셋까지
export function conceptsOf(text: { title: string; body: string }): string[] {
  const scored = CONCEPTS.map((c) => {
    const re = new RegExp(c.match.source, 'gi');
    return { id: c.id, score: (text.title.match(re)?.length ?? 0) * 2 + (text.body.match(re)?.length ?? 0) };
  }).filter((s) => s.score > 0);
  return scored.sort((a, b) => b.score - a.score).slice(0, 3).map((s) => s.id).sort((a, b) => ORDER.indexOf(a) - ORDER.indexOf(b));
}

export interface ConceptEntry { href: string; key: string; title: string; description: string; minutes: number; image?: string; date: Date; concepts: string[]; hay: string }

// 한 언어의 모든 글(아티클 + 블로그)을 개념과 함께
export async function conceptEntries(lang: Lang): Promise<ConceptEntry[]> {
  const [posts, articles] = await Promise.all([getPosts(lang), getArticles(lang)]);
  const fromPost = (p: Post): ConceptEntry => {
    const tags = postTags(p);
    return {
      href: postUrl(p), key: `blog:${p.data.slug}`, title: p.data.title, description: p.data.description,
      minutes: postMinutes(p), image: p.data.image, date: p.data.date,
      concepts: conceptsOf({ title: p.data.title, body: [p.data.description, ...tags].join(' ') }),
      hay: [p.data.title, p.data.description, ...tags].join(' ').toLowerCase(),
    };
  };
  const fromArticle = (a: Article): ConceptEntry => ({
    href: articleUrl(a), key: a.id, title: a.data.title, description: a.data.description,
    minutes: a.data.readMinutes, date: a.data.date,
    concepts: conceptsOf({ title: a.data.title, body: [a.data.description, a.data.category].join(' ') }),
    hay: [a.data.title, a.data.description].join(' ').toLowerCase(),
  });
  return [...articles.map(fromArticle), ...posts.map(fromPost)].sort((a, b) => b.date.getTime() - a.date.getTime());
}

// 글 한 편의 개념 사슬과 개념별 글 수 (언어마다 한 번만 계산해 둔다)
const cache = new Map<Lang, Promise<ConceptEntry[]>>();
export async function conceptNet(lang: Lang, href: string) {
  if (!cache.has(lang)) cache.set(lang, conceptEntries(lang));
  const entries = await cache.get(lang)!;
  const ids = entries.find((e) => e.href === href)?.concepts ?? [];
  const counts = Object.fromEntries(CONCEPTS.map((c) => [c.id, entries.filter((e) => e.concepts.includes(c.id)).length]));
  return { ids, counts };
}
