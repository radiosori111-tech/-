/** @jsxImportSource preact */
// 습관 반응을 '상황 → 튀어나오는 반응 → 대신 할 행동'으로 적으면, 습관 역전 훈련 방식의 계획 문장을 만들어 준다.
// 대신 할 행동은 원래 반응과 동시에 할 수 없는 것을 고르도록 예시를 함께 보여 준다. 아무것도 저장하지 않는다(client:visible).
import { useState } from 'preact/hooks';
import './widgets.css';

type Lang = 'ko' | 'en' | 'ja';
type Key = 'cue' | 'habit' | 'swap';
const KEYS: Key[] = ['cue', 'habit', 'swap'];

const T = {
  ko: {
    eyebrow: '직접 바꿔 보기', title: '습관 반응 바꾸기 계획',
    labels: { cue: '언제, 어디서 튀어나오나요?', habit: '튀어나오는 반응', swap: '대신 할 행동 (원래 반응과 동시에 못 하는 것)' },
    holders: { cue: '예: 회의에서 반대 의견을 들을 때', habit: '예: 아니, 그게 아니라', swap: '예: 숨을 내쉬고 "어떤 점에서요?"라고 묻는다' },
    ideas: ['입을 다문 채 숨을 길게 내쉰다', '두 손을 깍지 끼고 3초 센다', '"어떤 점에서요?"라고 묻는다', '물 한 모금 마신다'],
    idea: '대신 할 행동 예시',
    empty: '세 칸을 채우면 나의 바꾸기 계획이 만들어집니다.',
    plan: (c: string, h: string, s: string) => `만약 ${c}, ‘${h}’ 반응이 나오려 하면 나는 ${s}.`,
    note: '습관 역전 훈련은 반응이 나오는 상황을 알아차리고, 그와 동시에 할 수 없는 행동으로 바꿔 반복하는 방법입니다(Bate 외, 2011). 입력은 저장되지 않습니다.',
  },
  en: {
    eyebrow: 'Try it yourself', title: 'Plan to swap a habitual reaction',
    labels: { cue: 'When and where does it pop out?', habit: 'The reaction that pops out', swap: 'What you will do instead (something you can’t do at the same time)' },
    holders: { cue: 'e.g. when I hear an objection in a meeting', habit: 'e.g. start with "No, that’s not it"', swap: 'e.g. breathe out and ask "In what way?"' },
    ideas: ['breathe out slowly with my mouth closed', 'clasp my hands and count to three', 'ask "In what way?"', 'take a sip of water'],
    idea: 'Ideas for what to do instead',
    empty: 'Fill in all three boxes and your swap plan will appear here.',
    plan: (c: string, h: string, s: string) => `If ${c} and I feel the urge to ${h}, then I will ${s}.`,
    note: 'Habit reversal training means noticing the situation that triggers a reaction and repeatedly swapping in an action you can’t do at the same time (Bate et al., 2011). Nothing you type is saved.',
  },
  ja: {
    eyebrow: '変えてみる', title: '習慣の反応を置きかえる計画',
    labels: { cue: 'いつ、どこで出てきますか？', habit: '出てくる反応', swap: 'かわりにする行動（もとの反応と同時にできないもの）' },
    holders: { cue: '例：会議で反対意見を聞いたとき', habit: '例：いや、そうじゃなくて', swap: '例：息をはいて「どんな点でですか？」とたずねる' },
    ideas: ['口を閉じたまま長く息をはく', '両手を組んで3秒数える', '「どんな点でですか？」とたずねる', '水をひと口飲む'],
    idea: 'かわりにする行動の例',
    empty: '3つの欄を埋めると、自分の置きかえ計画ができあがります。',
    plan: (c: string, h: string, s: string) => `もし${c}、「${h}」が出そうになったら、わたしは${s}。`,
    note: 'ハビット・リバーサル・トレーニングは、反応が出る状況に気づき、それと同時にできない行動に置きかえてくり返す方法です（Bate ほか、2011）。入力は保存されません。',
  },
};

export default function HabitSwap({ lang = 'ko' }: { lang?: Lang }) {
  const t = T[lang];
  const [v, setV] = useState<Record<Key, string>>({ cue: '', habit: '', swap: '' });
  const trim = (s: string) => s.trim().replace(/[.。]+$/, '');
  const ready = KEYS.every((k) => trim(v[k]));
  return (
    <div class="widget" data-widget="habitswap">
      <p class="widget-eyebrow">{t.eyebrow}</p>
      <p class="widget-title">{t.title}</p>
      <div class="woop-fields">
        {KEYS.map((k) => (
          <label class="woop-field" for={`hs-${k}`}>
            <span>{t.labels[k]}</span>
            <input id={`hs-${k}`} type="text" maxLength={80} value={v[k]} placeholder={t.holders[k]}
              onInput={(e) => setV({ ...v, [k]: (e.target as HTMLInputElement).value })} />
          </label>
        ))}
      </div>
      <p class="rs-progress hs-idea-label">{t.idea}</p>
      <div class="fw-choices">
        {t.ideas.map((x) => (
          <button type="button" class={`bmap-chip${v.swap === x ? ' is-on' : ''}`} onClick={() => setV((p) => ({ ...p, swap: x }))}>{x}</button>
        ))}
      </div>
      <p class={`woop-result${ready ? ' is-ready' : ''}`} aria-live="polite">
        {ready ? t.plan(trim(v.cue), trim(v.habit), trim(v.swap)) : t.empty}
      </p>
      <p class="widget-note">{t.note}</p>
    </div>
  );
}
