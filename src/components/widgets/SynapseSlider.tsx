/** @jsxImportSource preact */
// 반복할수록 시냅스 연결이 굵어지는 모습을 보여 주는 슬라이더. 화면에 보일 때만 스크립트를 붙인다(client:visible).
import { useState } from 'preact/hooks';
import './widgets.css';

type Lang = 'ko' | 'en' | 'ja';
const T = {
  ko: {
    eyebrow: '직접 움직여 보기', title: '같은 행동을 반복할수록 시냅스는 어떻게 바뀔까', days: '반복한 날', strength: '연결 세기',
    pre: '보내는 신경세포', post: '받는 신경세포',
    stage: ['아직은 새 길을 내는 중입니다. 신호가 건너가려면 애를 써야 합니다.', '연결이 굵어지고 있습니다. 같은 상황에서 행동이 조금씩 쉬워집니다.', '자주 다닌 길처럼 신호가 쉽게 건너갑니다. 행동이 점점 저절로 일어납니다.'],
    note: '헵의 원리(함께 활성화되는 신경세포는 연결이 강해진다)를 단순하게 그린 개념도입니다. 실제로 습관이 자동화되는 데 걸린 기간은 사람마다 18일에서 254일까지 달랐습니다(Lally 외, 2010).',
    unit: (n: number) => `${n}일`,
  },
  en: {
    eyebrow: 'Try it yourself', title: 'How does a synapse change as you repeat a behavior?', days: 'Days repeated', strength: 'Connection strength',
    pre: 'Sending neuron', post: 'Receiving neuron',
    stage: ['Still clearing a new path. The signal has to work hard to get across.', 'The connection is thickening. The behavior gets a little easier in the same situation.', 'Like a well-worn path, the signal crosses easily. The behavior starts to happen on its own.'],
    note: 'A simplified picture of Hebb’s principle (neurons that fire together strengthen their connection). In real measurements, habits took anywhere from 18 to 254 days to become automatic (Lally et al., 2010).',
    unit: (n: number) => `${n} ${n === 1 ? 'day' : 'days'}`,
  },
  ja: {
    eyebrow: '動かしてみる', title: '同じ行動をくり返すと、シナプスはどう変わるのか', days: 'くり返した日数', strength: 'つながりの強さ',
    pre: '送る神経細胞', post: '受け取る神経細胞',
    stage: ['まだ新しい道をつくっている途中です。信号が渡るにはがんばりが必要です。', 'つながりが太くなってきました。同じ場面での行動が少しずつ楽になります。', 'よく通る道のように、信号がすっと渡ります。行動がしだいに自然に起こるようになります。'],
    note: 'ヘッブの法則(いっしょに活動する神経細胞はつながりが強まる)を単純化した概念図です。実際の測定では、習慣が自動化するまでの期間は人によって18日から254日までさまざまでした(Lally ほか、2010)。',
    unit: (n: number) => `${n}日`,
  },
};

export default function SynapseSlider({ lang = 'ko' }: { lang?: Lang }) {
  const t = T[lang];
  const [days, setDays] = useState(10);
  const s = 1 - Math.exp(-days / 22); // 0 → 약 0.95
  const pct = Math.round(s * 100);
  const vesicles = 3 + Math.round(s * 9);
  const dots = Math.round(s * 14);
  const receptors = 3 + Math.round(s * 7);
  const stage = s < 0.35 ? 0 : s < 0.75 ? 1 : 2;
  return (
    <div class="widget" data-widget="synapse">
      <p class="widget-eyebrow">{t.eyebrow}</p>
      <p class="widget-title">{t.title}</p>
      <figure class="syn-figure">
        <svg viewBox="0 0 560 220" role="img" aria-label={`${t.strength} ${pct}%`}>
          <path class="syn-axon" d="M0 110H170" style={{ strokeWidth: 3 + s * 9 }} />
          <path class="syn-cell" d="M150 40h70a40 40 0 0 1 40 40v60a40 40 0 0 1-40 40h-70z" />
          <path class="syn-cell" d="M410 40h-70a40 40 0 0 0-40 40v60a40 40 0 0 0 40 40h70z" />
          <path class="syn-axon" d="M390 110H560" style={{ strokeWidth: 3 + s * 9 }} />
          <circle class="syn-glow" cx="345" cy="110" r="62" style={{ opacity: s * 0.18 }} />
          {Array.from({ length: 12 }, (_, i) => (
            <circle class="syn-vesicle" cx={185 + (i % 3) * 22} cy={68 + Math.floor(i / 3) * 26} r="8" style={{ opacity: i < vesicles ? 1 : 0.12 }} />
          ))}
          {Array.from({ length: 14 }, (_, i) => (
            <circle class="syn-dot" cx={270 + (i % 4) * 7} cy={62 + i * 7} r="3" style={{ opacity: i < dots ? 1 : 0 }} />
          ))}
          {Array.from({ length: 10 }, (_, i) => (
            <rect class="syn-receptor" x="298" y={58 + i * 11} width="7" height="7" rx="2" style={{ opacity: i < receptors ? 1 : 0.15 }} />
          ))}
          <text class="syn-label" x="205" y="210" text-anchor="middle">{t.pre}</text>
          <text class="syn-label" x="355" y="210" text-anchor="middle">{t.post}</text>
        </svg>
      </figure>
      <div class="syn-controls">
        <div class="syn-row">
          <label for={`syn-${lang}`}>{t.days} <strong>{t.unit(days)}</strong></label>
          <span>{t.strength} <strong>{pct}%</strong></span>
        </div>
        <input
          id={`syn-${lang}`}
          class="syn-range"
          type="range"
          min={0}
          max={66}
          value={days}
          aria-valuetext={`${t.unit(days)}, ${t.strength} ${pct}%`}
          onInput={(e) => setDays(Number((e.target as HTMLInputElement).value))}
        />
      </div>
      <p class="syn-caption" aria-live="polite">{t.stage[stage]}</p>
      <p class="widget-note">{t.note}</p>
    </div>
  );
}
