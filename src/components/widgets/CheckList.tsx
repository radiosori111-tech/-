/** @jsxImportSource preact */
// 생활 습관 자가 점검표. 해당하는 항목을 고르면 몇 개인지 세고, 고른 항목마다 바로 해 볼 일을 보여 준다.
// 항목과 팁은 글에서 props로 넘긴다. 진단이 아니라 돌아보기용이며, 아무것도 저장하거나 보내지 않는다(client:visible).
import { useState } from 'preact/hooks';
import './widgets.css';

type Lang = 'ko' | 'en' | 'ja';
const T = {
  ko: { eyebrow: '스스로 점검하기', count: (n: number, all: number) => `${all}개 중 ${n}개에 해당합니다.`, none: '해당하는 항목을 눌러 보세요.', start: '여기부터 바꿔 보세요', reset: '다시 하기' },
  en: { eyebrow: 'Self-check', count: (n: number, all: number) => `${n} of ${all} apply to you.`, none: 'Tap the items that apply to you.', start: 'Start here', reset: 'Reset' },
  ja: { eyebrow: 'セルフチェック', count: (n: number, all: number) => `${all}項目中${n}項目に当てはまります。`, none: '当てはまる項目を押してみてください。', start: 'ここから変えてみましょう', reset: 'やり直す' },
};

interface Props { lang?: Lang; title: string; items: string[]; tips: string[]; note?: string }

export default function CheckList({ lang = 'ko', title, items, tips, note }: Props) {
  const t = T[lang];
  const [on, setOn] = useState<boolean[]>(items.map(() => false));
  const n = on.filter(Boolean).length;
  const toggle = (i: number) => setOn((prev) => prev.map((v, j) => (j === i ? !v : v)));
  return (
    <div class="widget" data-widget="checklist">
      <p class="widget-eyebrow">{t.eyebrow}</p>
      <p class="widget-title">{title}</p>
      <ul class="quiz-options">
        {items.map((it, i) => (
          <li>
            <button type="button" role="checkbox" aria-checked={on[i]} class={`quiz-option check-item${on[i] ? ' is-right' : ''}`} onClick={() => toggle(i)}>
              <span class="check-box" aria-hidden="true">{on[i] ? '✓' : ''}</span>{it}
            </button>
          </li>
        ))}
      </ul>
      <p class="quiz-feedback" aria-live="polite"><strong>{n ? t.count(n, items.length) : t.none}</strong></p>
      {n > 0 && (
        <div class="check-tips">
          <p class="check-tips-title">{t.start}</p>
          <ul>{items.map((_, i) => on[i] && <li>{tips[i]}</li>)}</ul>
        </div>
      )}
      {n > 0 && <button type="button" class="quiz-retry" onClick={() => setOn(items.map(() => false))}>{t.reset}</button>}
      {note && <p class="widget-note">{note}</p>}
    </div>
  );
}
