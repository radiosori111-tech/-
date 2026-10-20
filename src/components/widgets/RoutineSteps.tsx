/** @jsxImportSource preact */
// 단계별로 따라 하는 루틴. 단계를 끝낼 때마다 눌러 진행 막대를 채우고, 지금 할 단계의 방법을 보여 준다.
// 단계 이름·시간·방법은 글에서 props로 넘긴다. 아무것도 저장하거나 보내지 않는다(client:visible).
import { useState } from 'preact/hooks';
import './widgets.css';

type Lang = 'ko' | 'en' | 'ja';
const T = {
  ko: { eyebrow: '따라 해 보기', done: '끝냈어요', now: '지금 할 단계', all: '모든 단계를 마쳤습니다. 수고하셨습니다.', reset: '처음부터', progress: (d: number, n: number) => `${n}단계 중 ${d}단계 완료` },
  en: { eyebrow: 'Follow along', done: 'Done', now: 'Current step', all: 'You finished every step. Nice work.', reset: 'Start over', progress: (d: number, n: number) => `${d} of ${n} steps done` },
  ja: { eyebrow: 'いっしょにやってみる', done: '終わりました', now: '今のステップ', all: 'すべてのステップを終えました。おつかれさまでした。', reset: '最初から', progress: (d: number, n: number) => `${n}ステップ中${d}ステップ完了` },
};

interface Props { lang?: Lang; title: string; steps: string[]; times: string[]; how: string[]; note?: string }

export default function RoutineSteps({ lang = 'ko', title, steps, times, how, note }: Props) {
  const t = T[lang];
  const [done, setDone] = useState(0);
  const n = steps.length;
  return (
    <div class="widget" data-widget="routine">
      <p class="widget-eyebrow">{t.eyebrow}</p>
      <p class="widget-title">{title}</p>
      <div class="ft-bar" aria-hidden="true"><span style={{ width: `${(done / n) * 100}%` }} /></div>
      <p class="rs-progress" aria-live="polite">{t.progress(done, n)}</p>
      <ol class="rs-list">
        {steps.map((s, i) => (
          <li class={i < done ? 'is-done' : i === done ? 'is-now' : ''}>
            <span class="rs-num" aria-hidden="true">{i < done ? '✓' : i + 1}</span>
            <span class="rs-name">{s}</span>
            <span class="rs-time">{times[i]}</span>
          </li>
        ))}
      </ol>
      {done < n ? (
        <div class="check-tips">
          <p class="check-tips-title">{t.now}: {steps[done]}</p>
          <p class="rs-how">{how[done]}</p>
          <button type="button" class="quiz-retry ft-main" onClick={() => setDone((d) => Math.min(n, d + 1))}>{t.done}</button>
        </div>
      ) : (
        <div class="check-tips"><p class="check-tips-title">{t.all}</p></div>
      )}
      {done > 0 && <button type="button" class="quiz-retry" onClick={() => setDone(0)}>{t.reset}</button>}
      {note && <p class="widget-note">{note}</p>}
    </div>
  );
}
