/** @jsxImportSource preact */
// 상황 고르기 → 맞춤 실천법. 지금 내 상태 하나를 고르면 그에 맞는 방법과 근거를 보여 준다.
// 선택지·방법·근거는 글에서 props로 넘긴다. 아무것도 저장하거나 보내지 않는다(client:visible).
import { useState } from 'preact/hooks';
import './widgets.css';

type Lang = 'ko' | 'en' | 'ja';
const T = {
  ko: { eyebrow: '나에게 맞는 방법 찾기', none: '지금 내 상태에 가까운 것을 하나 골라 보세요.', plan: '이렇게 해 보세요', why: '근거', reset: '다시 고르기' },
  en: { eyebrow: 'Find what fits you', none: 'Pick the one closest to how you feel right now.', plan: 'Try this', why: 'Evidence', reset: 'Pick again' },
  ja: { eyebrow: '自分に合う方法を探す', none: '今の自分の状態にいちばん近いものを一つ選んでください。', plan: 'こうしてみましょう', why: '根拠', reset: '選び直す' },
};

interface Props { lang?: Lang; title: string; options: string[]; plans: string[]; why?: string[]; note?: string }

export default function PickPlan({ lang = 'ko', title, options, plans, why, note }: Props) {
  const t = T[lang];
  const [pick, setPick] = useState<number | null>(null);
  return (
    <div class="widget" data-widget="pickplan">
      <p class="widget-eyebrow">{t.eyebrow}</p>
      <p class="widget-title">{title}</p>
      <ul class="quiz-options">
        {options.map((o, i) => (
          <li>
            <button type="button" aria-pressed={pick === i} class={`quiz-option${pick === i ? ' is-right' : ''}`} onClick={() => setPick(i)}>{o}</button>
          </li>
        ))}
      </ul>
      {pick === null ? (
        <p class="quiz-feedback" aria-live="polite">{t.none}</p>
      ) : (
        <div class="check-tips" aria-live="polite">
          <p class="check-tips-title">{t.plan}</p>
          <p class="pick-plan">{plans[pick]}</p>
          {why && why[pick] && <p class="pick-why"><strong>{t.why}</strong> · {why[pick]}</p>}
        </div>
      )}
      {pick !== null && <button type="button" class="quiz-retry" onClick={() => setPick(null)}>{t.reset}</button>}
      {note && <p class="widget-note">{note}</p>}
    </div>
  );
}
