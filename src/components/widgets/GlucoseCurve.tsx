/** @jsxImportSource preact */
// 식사 방법 세 가지를 켜고 끄면 식후 혈당 곡선(개념도)이 어떻게 완만해지는지 보여 준다.
// 실제 측정값이 아니라 연구 결과의 방향을 단순화한 그림이다. 화면에 보일 때만 스크립트를 붙인다(client:visible).
import { useState } from 'preact/hooks';
import './widgets.css';

type Lang = 'ko' | 'en' | 'ja';
type Key = 'order' | 'whole' | 'walk';
const KEYS: Key[] = ['order', 'whole', 'walk'];

const T = {
  ko: {
    eyebrow: '직접 바꿔 보기', title: '같은 한 끼, 먹는 방법에 따라 혈당 곡선은?',
    opts: { order: '채소·단백질 먼저, 밥은 마지막', whole: '흰빵 대신 통곡물·현미', walk: '식후 10분 걷기' },
    tips: {
      order: '탄수화물을 마지막에 먹자 식후 혈당과 인슐린이 낮아졌습니다(Shukla 외, 2015·2017).',
      whole: '혈당 지수가 낮은 식사 뒤에는 몇 시간 뒤의 배고픔과 다음 끼니 섭취량이 줄었습니다(Ludwig 외, 1999).',
      walk: '매 끼니 뒤 10분 걷기는 하루 한 번 30분 걷기보다 식후 혈당을 더 낮췄습니다(Reynolds 외, 2016).',
    },
    none: '위의 선택지를 켜 보세요. 아무것도 하지 않은 곡선은 빨리 솟았다가 빨리 떨어집니다.',
    base: '그대로 먹었을 때', now: '바꾼 뒤', axisT: '식후 시간', axisG: '혈당',
    note: '연구 결과의 방향을 단순화한 개념도이며 실제 수치가 아닙니다. 혈당 반응은 사람마다 다릅니다.',
  },
  en: {
    eyebrow: 'Try it yourself', title: 'Same meal, different habits: what happens to the blood sugar curve?',
    opts: { order: 'Vegetables and protein first, carbs last', whole: 'Whole grains instead of white bread', walk: 'A 10-minute walk after eating' },
    tips: {
      order: 'Eating carbohydrates last lowered post-meal blood sugar and insulin (Shukla et al., 2015, 2017).',
      whole: 'After a low-glycemic-index meal, people were less hungry hours later and ate less at the next meal (Ludwig et al., 1999).',
      walk: 'A 10-minute walk after each meal lowered post-meal blood sugar more than one 30-minute walk a day (Reynolds et al., 2016).',
    },
    none: 'Turn on the options above. With no changes, the curve shoots up fast and drops fast.',
    base: 'Eaten as usual', now: 'With changes', axisT: 'Time after eating', axisG: 'Blood sugar',
    note: 'A simplified concept drawing of the direction of research findings, not real measurements. Blood sugar responses vary from person to person.',
  },
  ja: {
    eyebrow: '変えてみる', title: '同じ食事でも、食べ方しだいで血糖値の曲線は？',
    opts: { order: '野菜・タンパク質を先に、ごはんは最後', whole: '白いパンのかわりに全粒穀物・玄米', walk: '食後10分歩く' },
    tips: {
      order: '炭水化物を最後に食べると、食後の血糖値とインスリンが低くなりました（Shukla ほか、2015・2017）。',
      whole: '血糖指数の低い食事のあとは、数時間後の空腹感と次の食事の量が減りました（Ludwig ほか、1999）。',
      walk: '毎食後10分歩くほうが、1日1回30分歩くより食後の血糖値を下げました（Reynolds ほか、2016）。',
    },
    none: '上の選択肢をオンにしてみてください。何も変えない曲線は、すばやく上がってすばやく下がります。',
    base: 'いつもどおり食べたとき', now: '変えたあと', axisT: '食後の時間', axisG: '血糖値',
    note: '研究結果の方向を単純化した概念図で、実際の数値ではありません。血糖値の反応は人によって異なります。',
  },
};

// 식후 0~180분 곡선. peak는 정점 높이, fall은 정점 뒤 기준선 아래로 떨어지는 정도(반동), tau는 정점까지 걸리는 분.
function path(peak: number, fall: number, tau = 30) {
  const pts: string[] = [];
  for (let m = 0; m <= 180; m += 6) {
    const rise = peak * (m / tau) * Math.exp(1 - m / tau);
    const dip = -fall * Math.exp(-((m - 120) ** 2) / 1200);
    const x = 40 + (m / 180) * 420;
    const y = 130 - (rise + dip);
    pts.push(`${m === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`);
  }
  return pts.join(' ');
}

export default function GlucoseCurve({ lang = 'ko' }: { lang?: Lang }) {
  const t = T[lang];
  const [on, setOn] = useState<Record<Key, boolean>>({ order: false, whole: false, walk: false });
  const n = KEYS.filter((k) => on[k]).length;
  const peak = 95 * (on.order ? 0.72 : 1) * (on.whole ? 0.8 : 1) * (on.walk ? 0.85 : 1);
  const fall = 30 * (on.whole ? 0.3 : 1) * (on.order ? 0.6 : 1);
  const tau = on.whole ? 42 : on.order ? 36 : 30;
  return (
    <div class="widget" data-widget="glucose">
      <p class="widget-eyebrow">{t.eyebrow}</p>
      <p class="widget-title">{t.title}</p>
      <div class="fw-choices" role="group">
        {KEYS.map((k) => (
          <button type="button" aria-pressed={on[k]} class={`bmap-chip${on[k] ? ' is-on' : ''}`}
            onClick={() => setOn((prev) => ({ ...prev, [k]: !prev[k] }))}>{t.opts[k]}</button>
        ))}
      </div>
      <figure class="gc-figure">
        <svg viewBox="0 0 480 170" role="img" aria-label={t.title}>
          <line class="gc-axis" x1="40" y1="130" x2="460" y2="130" />
          <line class="gc-axis" x1="40" y1="20" x2="40" y2="160" />
          <text class="syn-label" x="460" y="166" text-anchor="end">{t.axisT}</text>
          <text class="syn-label" x="46" y="28">{t.axisG}</text>
          <path class="gc-base" d={path(95, 30)} />
          {n > 0 && <path class="gc-now" d={path(peak, fall, tau)} />}
        </svg>
      </figure>
      <div class="fw-legend"><span><i class="fw-dot gc-dot-base" />{t.base}</span>{n > 0 && <span><i class="fw-dot fw-dot-eat" />{t.now}</span>}</div>
      <div class="syn-caption" aria-live="polite">
        {n === 0 ? <p class="gc-tip">{t.none}</p> : KEYS.filter((k) => on[k]).map((k) => <p class="gc-tip">{t.tips[k]}</p>)}
      </div>
      <p class="widget-note">{t.note}</p>
    </div>
  );
}
