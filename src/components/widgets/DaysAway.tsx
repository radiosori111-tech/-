/** @jsxImportSource preact */
// 목표까지 남은 기간을 '년' 대신 '일'로 바꿔 보여 주고, 오늘 할 첫 행동을 한 문장으로 적게 한다.
// 미래를 일 단위로 셀 때 더 가깝게 느껴 일찍 시작하려 했다는 연구(Lewis & Oyserman, 2015)를 따른 연습이다. 아무것도 저장하지 않는다(client:visible).
import { useState } from 'preact/hooks';
import './widgets.css';

type Lang = 'ko' | 'en' | 'ja';
const T = {
  ko: {
    eyebrow: '직접 바꿔 보기', title: '목표까지, 년 대신 날로 세어 보기',
    goal: '이루고 싶은 목표', goalHolder: '예: 노후 자금 마련, 10kg 감량',
    years: '남은 기간', yr: (n: number) => `${n}년`,
    first: '오늘 할 첫 행동', firstHolder: '예: 자동이체 1만 원 설정',
    big: (d: string) => `${d}일 뒤`,
    line: (g: string, d: string, f: string) => `${g}까지 ${d}일. 그 첫날인 오늘 할 일: ${f}.`,
    empty: '목표와 오늘 할 첫 행동을 적어 보세요.',
    hard: '하다가 힘들어지면 “이건 나와 안 맞는다”가 아니라 “중요한 일이라 어렵다”로 읽어 보세요.',
    note: '같은 미래도 “20년 뒤”보다 “7,300일 뒤”로 들었을 때 사람들은 더 일찍 저축을 시작하려 했습니다(Lewis & Oyserman, 2015).',
  },
  en: {
    eyebrow: 'Try it yourself', title: 'Count the way to your goal in days, not years',
    goal: 'The goal you want to reach', goalHolder: 'e.g. a retirement fund, losing 10 kg',
    years: 'Time left', yr: (n: number) => `${n} ${n === 1 ? 'year' : 'years'}`,
    first: 'One first step today', firstHolder: 'e.g. set up a $10 automatic transfer',
    big: (d: string) => `${d} days away`,
    line: (g: string, d: string, f: string) => `${d} days until ${g}. Today, day one, I will ${f}.`,
    empty: 'Write down your goal and one first step for today.',
    hard: 'When it gets hard, read it not as "this isn’t for me" but as "this is hard because it matters."',
    note: 'Hearing the same future as "7,300 days" rather than "20 years" made people want to start saving sooner (Lewis & Oyserman, 2015).',
  },
  ja: {
    eyebrow: '変えてみる', title: '目標まで、年ではなく日で数えてみる',
    goal: 'かなえたい目標', goalHolder: '例：老後資金づくり、10kg減量',
    years: '残りの期間', yr: (n: number) => `${n}年`,
    first: '今日する最初の行動', firstHolder: '例：1,000円の自動振替を設定する',
    big: (d: string) => `${d}日後`,
    line: (g: string, d: string, f: string) => `${g}まで${d}日。その1日目の今日すること：${f}。`,
    empty: '目標と、今日する最初の行動を書いてみてください。',
    hard: 'やっていて苦しくなったら「自分に合わない」ではなく「大切なことだからむずかしい」と読みかえてみましょう。',
    note: '同じ未来でも「20年後」より「7,300日後」と聞いたとき、人はより早く貯金を始めようとしました（Lewis & Oyserman、2015）。',
  },
};

export default function DaysAway({ lang = 'ko' }: { lang?: Lang }) {
  const t = T[lang];
  const [goal, setGoal] = useState('');
  const [years, setYears] = useState(20);
  const [first, setFirst] = useState('');
  const days = (years * 365).toLocaleString(lang === 'en' ? 'en-US' : lang === 'ja' ? 'ja-JP' : 'ko-KR');
  const trim = (s: string) => s.trim().replace(/[.。]+$/, '');
  const ready = trim(goal) && trim(first);
  return (
    <div class="widget" data-widget="daysaway">
      <p class="widget-eyebrow">{t.eyebrow}</p>
      <p class="widget-title">{t.title}</p>
      <div class="woop-fields">
        <label class="woop-field" for="da-goal"><span>{t.goal}</span>
          <input id="da-goal" type="text" maxLength={60} value={goal} placeholder={t.goalHolder} onInput={(e) => setGoal((e.target as HTMLInputElement).value)} />
        </label>
      </div>
      <div class="syn-controls">
        <div class="syn-row"><label for="da-years">{t.years}</label><strong>{t.yr(years)}</strong></div>
        <input id="da-years" class="syn-range" type="range" min={1} max={30} step={1} value={years} onInput={(e) => setYears(Number((e.target as HTMLInputElement).value))} />
      </div>
      <div class="ft-clock" aria-live="polite">{t.big(days)}</div>
      <div class="woop-fields">
        <label class="woop-field" for="da-first"><span>{t.first}</span>
          <input id="da-first" type="text" maxLength={60} value={first} placeholder={t.firstHolder} onInput={(e) => setFirst((e.target as HTMLInputElement).value)} />
        </label>
      </div>
      <p class={`woop-result${ready ? ' is-ready' : ''}`} aria-live="polite">{ready ? t.line(trim(goal), days, trim(first)) : t.empty}</p>
      <p class="syn-caption">{t.hard}</p>
      <p class="widget-note">{t.note}</p>
    </div>
  );
}
