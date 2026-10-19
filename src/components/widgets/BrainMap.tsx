/** @jsxImportSource preact */
// 뇌 구조 지도: 옆에서 본 뇌의 엽과 안쪽 구조를 눌러 하는 일을 읽는다. 화면에 보일 때만 스크립트를 붙인다(client:visible).
import { useState } from 'preact/hooks';
import './widgets.css';

type Lang = 'ko' | 'en' | 'ja';
const CER = 'M118 246C96 170 152 88 238 68C310 46 392 50 452 86C522 126 552 198 528 258C512 302 470 324 430 320C412 346 370 356 338 340C304 360 252 354 226 330C176 336 132 302 118 246Z';
const CEREB = 'M412 318C442 330 486 322 500 296C516 330 488 370 444 370C418 368 402 350 412 318Z';
const STEM = 'M378 336C386 366 384 398 374 430C384 436 396 436 404 430C406 398 410 366 412 336Z';

// 엽은 뇌 윤곽 안에서 다각형으로 나눈다 (중심고랑 · 외측고랑 · 두정후두고랑을 따라)
const REGIONS = [
  { id: 'frontal', color: '#8ab4f8', d: 'M0 0H342L304 242L196 282L188 460H0Z' },
  { id: 'parietal', color: '#81c995', d: 'M342 0H468L470 214L404 192L304 242Z' },
  { id: 'occipital', color: '#fdd663', d: 'M468 0H640V330H458L470 214Z' },
  { id: 'temporal', color: '#f28b82', d: 'M196 282L404 192L470 214L458 330V460H188Z' },
] as const;

const TEXT: Record<Lang, { eyebrow: string; title: string; hint: string; note: string; parts: Record<string, [string, string]> }> = {
  ko: {
    eyebrow: '눌러서 살펴보기', title: '뇌의 각 부분은 무슨 일을 할까', hint: '그림이나 아래 이름을 눌러 보세요.',
    note: '뇌 영상 연구에서 하루 동안 쉬는 영역은 따로 없었습니다. 영역마다 맡은 일이 다르고, 일에 따라 함께 쓰이는 조합이 바뀝니다.',
    parts: {
      frontal: ['전두엽', '계획을 세우고 판단하며 충동을 누릅니다. 맨 앞의 전전두엽은 목표를 붙들고, 뒤쪽 운동피질은 움직임을 명령합니다.'],
      parietal: ['두정엽', '피부와 몸에서 오는 감각을 모으고, 내 몸과 물건이 공간 어디에 있는지 계산합니다.'],
      occipital: ['후두엽', '눈으로 들어온 시각 정보를 받아 모양, 색, 움직임으로 풀어냅니다.'],
      temporal: ['측두엽', '소리를 듣고 말을 알아듣습니다. 안쪽의 해마와 이어져 기억을 만드는 데도 함께 일합니다.'],
      cerebellum: ['소뇌', '균형을 잡고 움직임을 매끄럽게 다듬습니다. 자전거 타기 같은 몸의 기술을 익히는 데 중요합니다.'],
      stem: ['뇌줄기', '숨 쉬기, 심장 박동, 잠과 깸처럼 살아 있는 데 필요한 기본 일을 맡습니다.'],
      hippocampus: ['해마 (안쪽)', '새로운 경험을 기억으로 만들고, 잠자는 동안 대뇌피질로 옮겨 오래 남깁니다.'],
      basal: ['기저핵 (안쪽)', '여러 행동 가운데 하나를 고르고, 반복된 행동을 습관으로 자동화합니다.'],
    },
  },
  en: {
    eyebrow: 'Tap to explore', title: 'What does each part of the brain do?', hint: 'Tap the picture or a name below.',
    note: 'Brain imaging finds no region that sits idle over a day. Each area has its own job, and the mix that works together changes with the task.',
    parts: {
      frontal: ['Frontal lobe', 'Plans, judges and holds back impulses. The prefrontal cortex at the front keeps goals in mind; the motor cortex at the back sends movement commands.'],
      parietal: ['Parietal lobe', 'Gathers touch and body sensations and works out where your body and objects are in space.'],
      occipital: ['Occipital lobe', 'Receives what the eyes see and breaks it down into shape, color and motion.'],
      temporal: ['Temporal lobe', 'Hears sounds and understands speech, and works with the hippocampus inside it to form memories.'],
      cerebellum: ['Cerebellum', 'Keeps balance and smooths movement; key for learning physical skills such as riding a bike.'],
      stem: ['Brainstem', 'Runs the basics of staying alive: breathing, heartbeat, sleeping and waking.'],
      hippocampus: ['Hippocampus (inside)', 'Turns new experiences into memories and, during sleep, passes them to the cortex to keep.'],
      basal: ['Basal ganglia (inside)', 'Choose one action among many and automate repeated actions into habits.'],
    },
  },
  ja: {
    eyebrow: '押して見てみる', title: '脳のそれぞれの部分は何をしているのか', hint: '図か下の名前を押してみてください。',
    note: '脳画像の研究では、一日のあいだ休んでいる領域は見つかっていません。領域ごとに役割があり、作業によっていっしょに働く組み合わせが変わります。',
    parts: {
      frontal: ['前頭葉', '計画を立て、判断し、衝動を抑えます。いちばん前の前頭前野は目標を保ち、後ろ側の運動野は動きを指令します。'],
      parietal: ['頭頂葉', '皮膚や体からの感覚を集め、自分の体や物が空間のどこにあるかを計算します。'],
      occipital: ['後頭葉', '目から入った視覚情報を受け取り、形・色・動きに分けて読み解きます。'],
      temporal: ['側頭葉', '音を聞き、言葉を理解します。内側の海馬とつながり、記憶づくりにも関わります。'],
      cerebellum: ['小脳', 'バランスをとり、動きをなめらかに整えます。自転車に乗るような体の技術を覚えるのに大切です。'],
      stem: ['脳幹', '呼吸、心拍、眠りと目覚めのような、生きるための基本の仕事を担います。'],
      hippocampus: ['海馬(内側)', '新しい経験を記憶にし、眠っているあいだに大脳皮質へ移して長く残します。'],
      basal: ['大脳基底核(内側)', 'いくつもの行動から一つを選び、くり返した行動を習慣として自動化します。'],
    },
  },
};
const ORDER = ['frontal', 'parietal', 'occipital', 'temporal', 'cerebellum', 'stem', 'hippocampus', 'basal'];

export default function BrainMap({ lang = 'ko' }: { lang?: Lang }) {
  const t = TEXT[lang];
  const [on, setOn] = useState('frontal');
  const key = (id: string) => (e: KeyboardEvent) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setOn(id); } };
  const region = (id: string, extra: Record<string, unknown>) => ({
    class: `${extra.class as string}${on === id ? ' is-on' : ''}`,
    role: 'button', tabIndex: 0, 'aria-label': t.parts[id][0], 'aria-pressed': on === id,
    onClick: () => setOn(id), onKeyDown: key(id),
  });
  return (
    <div class="widget" data-widget="brainmap">
      <p class="widget-eyebrow">{t.eyebrow}</p>
      <p class="widget-title">{t.title}</p>
      <div class="bmap">
        <figure class="bmap-figure">
          <svg viewBox="90 40 450 400">
            <defs><clipPath id={`bmap-clip-${lang}`}><path d={CER} /></clipPath></defs>
            <g clip-path={`url(#bmap-clip-${lang})`}>
              {REGIONS.map((r) => <path d={r.d} fill={r.color} {...region(r.id, { class: 'bmap-region' })} />)}
            </g>
            <path d={CEREB} fill="#c58af9" {...region('cerebellum', { class: 'bmap-region' })} />
            <path d={STEM} fill="#78d9ec" {...region('stem', { class: 'bmap-region' })} />
            <path class="bmap-outline" d={CER} />
            <path {...region('hippocampus', { class: 'bmap-deep' })} d="M302 292C318 276 344 270 366 276C382 280 392 292 388 304C384 314 370 314 364 304" />
            <ellipse {...region('basal', { class: 'bmap-deep' })} cx="292" cy="212" rx="34" ry="22" />
          </svg>
        </figure>
        <div>
          <div class="bmap-panel" aria-live="polite">
            <h4>{t.parts[on][0]}</h4>
            <p>{t.parts[on][1]}</p>
          </div>
          <div class="bmap-chips" role="group" aria-label={t.hint}>
            {ORDER.map((id) => (
              <button type="button" class={`bmap-chip${on === id ? ' is-on' : ''}`} aria-pressed={on === id} onClick={() => setOn(id)}>{t.parts[id][0]}</button>
            ))}
          </div>
        </div>
      </div>
      <p class="widget-note">{t.note}</p>
    </div>
  );
}
