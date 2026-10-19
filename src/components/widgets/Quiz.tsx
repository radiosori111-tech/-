/** @jsxImportSource preact */
// 한 문제짜리 퀴즈. 고르면 정답과 해설을 보여 준다. 화면에 보일 때만 스크립트를 붙인다(client:visible).
import { useState } from 'preact/hooks';
import './widgets.css';

type Lang = 'ko' | 'en' | 'ja';
const T = {
  ko: { eyebrow: '확인 퀴즈', right: '맞았습니다.', wrong: '아쉽지만 정답이 아닙니다.', retry: '다시 풀기' },
  en: { eyebrow: 'Quick check', right: 'Correct.', wrong: 'Not quite.', retry: 'Try again' },
  ja: { eyebrow: '確認クイズ', right: '正解です。', wrong: '残念、正解ではありません。', retry: 'もう一度' },
};

interface Props { lang?: Lang; question: string; options: string[]; answer: number; explain: string }

export default function Quiz({ lang = 'ko', question, options, answer, explain }: Props) {
  const t = T[lang];
  const [picked, setPicked] = useState<number | null>(null);
  const done = picked !== null;
  return (
    <div class="widget" data-widget="quiz">
      <p class="widget-eyebrow">{t.eyebrow}</p>
      <p class="widget-title">{question}</p>
      <ul class="quiz-options">
        {options.map((o, i) => (
          <li>
            <button
              type="button"
              class={`quiz-option${done && i === answer ? ' is-right' : ''}${done && i === picked && i !== answer ? ' is-wrong' : ''}`}
              disabled={done}
              aria-pressed={picked === i}
              onClick={() => setPicked(i)}
            >
              {o}
            </button>
          </li>
        ))}
      </ul>
      <p class="quiz-feedback" aria-live="polite">
        {done && <><strong>{picked === answer ? t.right : t.wrong}</strong> {explain}</>}
      </p>
      {done && <button type="button" class="quiz-retry" onClick={() => setPicked(null)}>{t.retry}</button>}
    </div>
  );
}
