/** @jsxImportSource preact */
// 오늘 배운 것을 언제 다시 떠올려 볼지, 간격을 점점 넓히는 복습 날짜를 만들어 준다.
// 간격(1·3·7·14·30일)은 연구에서 흔히 쓰는 예시이며 최적값이 아니다. 아무것도 저장하지 않는다(client:visible).
import { useState } from 'preact/hooks';
import './widgets.css';

type Lang = 'ko' | 'en' | 'ja';
const GAPS = [1, 3, 7, 14, 30];

const T = {
  ko: {
    eyebrow: '직접 짜 보기', title: '오늘 배운 것, 언제 다시 떠올릴까?',
    what: '오늘 배운 것', holder: '예: 영어 단어 10개',
    mins: '한 번에 쓸 시간', min: (n: number) => `${n}분`,
    row: (d: number) => `${d}일 뒤`,
    total: (n: number, m: number) => `총 ${n}번, ${n * m}분이면 됩니다. 매번 책을 덮고 먼저 떠올려 본 뒤 확인하세요.`,
    empty: '배운 것을 적으면 복습 날짜가 만들어집니다.',
    fmt: (d: Date) => `${d.getMonth() + 1}월 ${d.getDate()}일`,
    note: '간격을 점점 넓히는 예시 일정입니다. 기억하고 싶은 기간이 길수록 간격도 넓히는 것이 효과적이었습니다(Cepeda 외, 2008).',
  },
  en: {
    eyebrow: 'Plan it yourself', title: 'When should you recall what you learned today?',
    what: 'What you learned today', holder: 'e.g. 10 English words',
    mins: 'Time per session', min: (n: number) => `${n} min`,
    row: (d: number) => `In ${d} ${d === 1 ? 'day' : 'days'}`,
    total: (n: number, m: number) => `That's ${n} sessions, ${n * m} minutes in all. Each time, close the book and try to recall first, then check.`,
    empty: 'Write down what you learned and your review dates will appear.',
    fmt: (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    note: 'An example schedule with gaps that widen over time. The longer you want to remember something, the wider the gaps that worked best (Cepeda et al., 2008).',
  },
  ja: {
    eyebrow: '組んでみる', title: '今日学んだこと、いつ思い出せばいい？',
    what: '今日学んだこと', holder: '例：英単語10個',
    mins: '1回にかける時間', min: (n: number) => `${n}分`,
    row: (d: number) => `${d}日後`,
    total: (n: number, m: number) => `全部で${n}回、${n * m}分です。毎回、本を閉じてまず思い出してから確かめましょう。`,
    empty: '学んだことを書くと、復習の日程ができあがります。',
    fmt: (d: Date) => `${d.getMonth() + 1}月${d.getDate()}日`,
    note: '間隔をだんだん広げる日程の例です。覚えておきたい期間が長いほど、間隔も広げるのが効果的でした（Cepeda ほか、2008）。',
  },
};

export default function SpacingPlan({ lang = 'ko' }: { lang?: Lang }) {
  const t = T[lang];
  const [what, setWhat] = useState('');
  const [mins, setMins] = useState(5);
  const today = new Date();
  const dates = GAPS.map((g) => { const d = new Date(today); d.setDate(d.getDate() + g); return d; });
  const ready = what.trim().length > 0;
  return (
    <div class="widget" data-widget="spacing">
      <p class="widget-eyebrow">{t.eyebrow}</p>
      <p class="widget-title">{t.title}</p>
      <div class="woop-fields">
        <label class="woop-field" for="sp-what">
          <span>{t.what}</span>
          <input id="sp-what" type="text" maxLength={60} value={what} placeholder={t.holder} onInput={(e) => setWhat((e.target as HTMLInputElement).value)} />
        </label>
      </div>
      <p class="rs-progress sp-label">{t.mins}</p>
      <div class="fw-choices" role="radiogroup" aria-label={t.mins}>
        {[5, 10, 15].map((m) => (
          <button type="button" role="radio" aria-checked={mins === m} class={`bmap-chip${mins === m ? ' is-on' : ''}`} onClick={() => setMins(m)}>{t.min(m)}</button>
        ))}
      </div>
      {ready ? (
        <>
          <ol class="rs-list rs-list" aria-live="polite">
            {dates.map((d, i) => (
              <li class={i === 0 ? 'is-now' : ''}>
                <span class="rs-num" aria-hidden="true">{i + 1}</span>
                <span class="rs-name">{t.fmt(d)} · {what.trim()}</span>
                <span class="rs-time">{t.row(GAPS[i])}</span>
              </li>
            ))}
          </ol>
          <p class="syn-caption">{t.total(GAPS.length, mins)}</p>
        </>
      ) : <p class="woop-result">{t.empty}</p>}
      <p class="widget-note">{t.note}</p>
    </div>
  );
}
