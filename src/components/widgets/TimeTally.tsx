/** @jsxImportSource preact */
// 목적 없이 흘려보내는 시간 계산기. 항목별 하루 시간을 고르면 하루·한 달·1년 합계를 보여 준다.
// 사람들은 휴대폰 사용을 실제보다 적게 어림했다는 연구(Andrews 외, 2015)를 바탕으로, 어림을 숫자로 바꿔 보는 도구. 아무것도 저장하지 않는다(client:visible).
import { useState } from 'preact/hooks';
import './widgets.css';

type Lang = 'ko' | 'en' | 'ja';
const T = {
  ko: {
    eyebrow: '직접 계산해 보기', title: '목적 없이 흘려보낸 시간은 얼마일까?',
    items: ['배달·쇼핑 앱 구경', 'SNS·짧은 영상', '알림 확인하다 이어진 화면', '그 밖에 멍하니 넘긴 시간'],
    min: (n: number) => `${n}분`,
    day: (m: number) => `하루 ${[Math.floor(m / 60) && `${Math.floor(m / 60)}시간`, m % 60 && `${m % 60}분`].filter(Boolean).join(' ')}`,
    year: (d: number) => `1년이면 약 ${d}일을 깨어 있는 채로 흘려보내는 셈입니다.`,
    month: (h: number) => `한 달이면 약 ${h}시간입니다.`,
    reset: '다시 하기',
    zero: '항목마다 하루에 쓰는 시간을 골라 보세요.',
    tip: '어림한 숫자는 실제보다 적기 쉽습니다. 오늘 하루는 휴대폰의 사용 시간 기록과 비교해 보세요.',
    note: '사람들은 휴대폰을 실제로 쓴 시간과 횟수를 절반 정도로 어림했습니다(Andrews 외, PLoS ONE, 2015). 1년 일수는 깨어 있는 16시간을 하루로 계산했습니다. 아무것도 저장되지 않습니다.',
  },
  en: {
    eyebrow: 'Calculate it yourself', title: 'How much time slips by without a purpose?',
    items: ['Browsing delivery and shopping apps', 'Social media and short videos', 'Screens that started with a notification', 'Other time that just drifted by'],
    min: (n: number) => `${n} min`,
    day: (m: number) => `${[Math.floor(m / 60) && `${Math.floor(m / 60)} h`, m % 60 && `${m % 60} min`].filter(Boolean).join(' ')} a day`,
    year: (d: number) => `Over a year, that's about ${d} waking days drifting by.`,
    month: (h: number) => `That's about ${h} hours a month.`,
    reset: 'Reset',
    zero: 'Pick how much time you spend on each item per day.',
    tip: 'Estimates tend to run low. Today, compare them with your phone’s screen-time record.',
    note: 'People estimated their actual phone use time and frequency at about half (Andrews et al., PLoS ONE, 2015). Yearly days count 16 waking hours as one day. Nothing is saved.',
  },
  ja: {
    eyebrow: '自分で計算してみる', title: '目的なく流れていった時間はどれくらい？',
    items: ['デリバリー・通販アプリをながめる', 'SNS・ショート動画', '通知の確認から続いた画面', 'そのほか、なんとなく過ぎた時間'],
    min: (n: number) => `${n}分`,
    day: (m: number) => `1日${[Math.floor(m / 60) && `${Math.floor(m / 60)}時間`, m % 60 && `${m % 60}分`].filter(Boolean).join('')}`,
    year: (d: number) => `1年で、起きている時間の約${d}日分が流れていく計算です。`,
    month: (h: number) => `1か月で約${h}時間です。`,
    reset: 'やり直す',
    zero: '項目ごとに1日に使う時間を選んでみてください。',
    tip: '見積もりは実際より少なくなりがちです。今日はスマートフォンの利用時間の記録と比べてみましょう。',
    note: '人はスマートフォンを実際に使った時間と回数を半分ほどに見積もっていました（Andrews ほか, PLoS ONE, 2015）。1年の日数は、起きている16時間を1日として計算しています。何も保存されません。',
  },
};

export default function TimeTally({ lang = 'ko' }: { lang?: Lang }) {
  const t = T[lang];
  const [mins, setMins] = useState<number[]>(t.items.map(() => 0));
  const total = mins.reduce((a, b) => a + b, 0);
  const set = (i: number, v: number) => setMins((prev) => prev.map((m, j) => (j === i ? v : m)));
  return (
    <div class="widget" data-widget="timetally">
      <p class="widget-eyebrow">{t.eyebrow}</p>
      <p class="widget-title">{t.title}</p>
      {t.items.map((label, i) => (
        <label class="cc-row">
          <span>{label} <strong>{t.min(mins[i])}</strong></span>
          <input type="range" min={0} max={120} step={5} value={mins[i]} class="syn-range"
            onInput={(e) => set(i, Number((e.target as HTMLInputElement).value))} />
        </label>
      ))}
      <div class="check-tips" aria-live="polite">
        {total === 0 ? <p class="pick-plan">{t.zero}</p> : (
          <>
            <p class="check-tips-title">{t.day(total)}</p>
            <p class="pick-plan">{t.month(Math.round((total * 30) / 60))} {t.year(Math.round((total * 365) / 60 / 16))}</p>
            <p class="pick-why">{t.tip}</p>
          </>
        )}
      </div>
      {total > 0 && <button type="button" class="quiz-retry" onClick={() => setMins(t.items.map(() => 0))}>{t.reset}</button>}
      <p class="widget-note">{t.note}</p>
    </div>
  );
}
