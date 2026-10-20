/** @jsxImportSource preact */
// 되고 싶은 모습과 오늘 할 작은 행동을 넣으면, 연구로 뒷받침되는 세 가지 방식(거리 두는 혼잣말·행동 짝짓기·저녁 돌아보기)으로 확언 문장을 바꿔 준다.
// 입력은 저장하거나 보내지 않는다. 화면에 보일 때만 스크립트를 붙인다(client:visible).
import { useState } from 'preact/hooks';
import './widgets.css';

type Lang = 'ko' | 'en' | 'ja';
const T = {
  ko: {
    eyebrow: '직접 바꿔 보기', title: '내 확언, 뇌에 닿는 문장으로 바꾸기',
    name: '내 이름 (선택)', who: '되고 싶은 모습', act: '오늘 할 작은 행동',
    holders: { name: '예: 은지', who: '예: 꾸준히 몸을 챙기는 사람', act: '예: 점심 뒤 10분 걷기' },
    empty: '되고 싶은 모습과 오늘 할 작은 행동을 넣어 보세요.',
    out: [
      ['아침, 거리 두는 혼잣말', (n: string, w: string, a: string) => `${n ? n + ', ' : ''}너는 오늘 ‘${a}’부터 해 볼 수 있어.`],
      ['행동과 짝짓기', (n: string, w: string, a: string) => `만약 오늘 핑계가 떠오르면, 나는 ‘${a}’부터 한다.`],
      ['저녁, 증거로 돌아보기', (n: string, w: string, a: string) => `오늘 한 일: ${a}. ${w}에 한 걸음 가까워졌다.`],
    ] as [string, (n: string, w: string, a: string) => string][],
    note: '“나는 이미 ~이다”를 되뇌는 대신, 이름을 부르는 혼잣말(Kross 외, 2014)과 행동 계획, 실제로 한 일을 근거로 삼는 방식을 따랐습니다. 입력은 저장되지 않습니다.',
  },
  en: {
    eyebrow: 'Try it yourself', title: 'Turn your affirmation into a sentence your brain can use',
    name: 'Your name (optional)', who: 'Who you want to be', act: 'One small action today',
    holders: { name: 'e.g. Jamie', who: 'e.g. someone who takes care of my body', act: 'e.g. walk for 10 minutes after lunch' },
    empty: 'Enter who you want to be and one small action for today.',
    out: [
      ['Morning: distanced self-talk', (n: string, w: string, a: string) => `${n ? n + ', you' : 'You'} can start today by doing this: ${a}.`],
      ['Pair it with action', (n: string, w: string, a: string) => `If an excuse comes up today, then I will ${a} first.`],
      ['Evening: review the evidence', (n: string, w: string, a: string) => `Today I did this: ${a}. I'm one step closer to being ${w}.`],
    ] as [string, (n: string, w: string, a: string) => string][],
    note: 'Instead of repeating "I already am…", this follows self-talk that uses your own name (Kross et al., 2014), action plans, and treating what you actually did as evidence. Nothing you type is saved.',
  },
  ja: {
    eyebrow: '変えてみる', title: '自分のアファメーションを、脳に届く文に変える',
    name: '自分の名前（任意）', who: 'なりたい姿', act: '今日する小さな行動',
    holders: { name: '例：ゆき', who: '例：こつこつ体を整える人', act: '例：昼食後に10分歩く' },
    empty: 'なりたい姿と、今日する小さな行動を入れてみてください。',
    out: [
      ['朝、距離をおいたひとりごと', (n: string, w: string, a: string) => `${n ? n + '、' : ''}あなたは今日、「${a}」から始められるよ。`],
      ['行動と組み合わせる', (n: string, w: string, a: string) => `もし今日いいわけが浮かんだら、わたしはまず「${a}」をする。`],
      ['夜、証拠でふり返る', (n: string, w: string, a: string) => `今日は「${a}」をした。「${w}」に一歩近づいた。`],
    ] as [string, (n: string, w: string, a: string) => string][],
    note: '「わたしはもう〜だ」をくり返すかわりに、自分の名前を呼ぶひとりごと（Kross ほか、2014）と行動の計画、実際にしたことを根拠にする方法にしたがいました。入力は保存されません。',
  },
};

export default function AffirmFix({ lang = 'ko' }: { lang?: Lang }) {
  const t = T[lang];
  const [v, setV] = useState({ name: '', who: '', act: '' });
  const trim = (s: string) => s.trim().replace(/[.。]+$/, '');
  const ready = trim(v.who) && trim(v.act);
  const field = (k: 'name' | 'who' | 'act', label: string) => (
    <label class="woop-field" for={`af-${k}`}>
      <span>{label}</span>
      <input id={`af-${k}`} type="text" maxLength={60} value={v[k]} placeholder={t.holders[k]}
        onInput={(e) => setV({ ...v, [k]: (e.target as HTMLInputElement).value })} />
    </label>
  );
  return (
    <div class="widget" data-widget="affirm">
      <p class="widget-eyebrow">{t.eyebrow}</p>
      <p class="widget-title">{t.title}</p>
      <div class="woop-fields">{field('name', t.name)}{field('who', t.who)}{field('act', t.act)}</div>
      <div class="mc-result" aria-live="polite">
        {ready ? (
          <ul class="mc-rows">
            {t.out.map(([label, make]) => (
              <li class="af-row"><strong>{label}</strong><span>{make(trim(v.name), trim(v.who), trim(v.act))}</span></li>
            ))}
          </ul>
        ) : <p class="woop-result">{t.empty}</p>}
      </div>
      <p class="widget-note">{t.note}</p>
    </div>
  );
}
