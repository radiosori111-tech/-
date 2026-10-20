/** @jsxImportSource preact */
// 지금 느끼는 감정과 하려던 행동을 고르면(문장에는 조사·활용을 붙인 feelsObj·urgesPlan을 쓴다) '감정 이름 붙이기 + 만약 ~하면' 문장을 만들어 준다.
// 고른 값은 저장하거나 보내지 않는다. 화면에 보일 때만 스크립트를 붙인다(client:visible).
import { useState } from 'preact/hooks';
import './widgets.css';

type Lang = 'ko' | 'en' | 'ja';
const T = {
  ko: {
    eyebrow: '직접 해 보기', title: '감정에 이름 붙이고 한 박자 늦추기',
    feel: '지금 느끼는 감정', urge: '하려던 행동',
    feels: ['짜증', '불안', '서운함', '외로움', '배고픔', '피곤함'],
    urges: ['야식 시키기', '충동구매', '화난 메시지 보내기', '할 일 미루기'],
    feelsObj: ['짜증을', '불안을', '서운함을', '외로움을', '배고픔을', '피곤함을'],
    urgesPlan: ['야식을 시키고', '충동구매를 하고', '화난 메시지를 보내고', '할 일을 미루고'],
    alts: ['물 한 잔 마시고 10분 뒤에 다시 정한다', '장바구니에만 담고 내일 다시 본다', '메시지를 임시 저장하고 10분 걷는다', '타이머 5분을 맞추고 딱 첫 줄만 시작한다'],
    empty: '감정과 행동을 하나씩 골라 보세요.',
    label: (f: string) => `“나는 지금 ${f} 느끼고 있다.”`,
    plan: (u: string, a: string) => `만약 ${u} 싶어지면, 나는 ${a}.`,
    note: '감정을 한 단어로 말하는 것만으로 편도체 반응이 줄었다는 연구(Lieberman 외, 2007)와 실행 의도 연구를 바탕으로 만든 연습입니다.',
  },
  en: {
    eyebrow: 'Try it yourself', title: 'Name the feeling, then slow down a beat',
    feel: 'What you feel right now', urge: 'What you were about to do',
    feels: ['irritation', 'anxiety', 'hurt', 'loneliness', 'hunger', 'tiredness'],
    urges: ['order late-night food', 'make an impulse buy', 'send an angry message', 'put off a task'],
    feelsObj: ['irritation', 'anxiety', 'hurt', 'loneliness', 'hunger', 'tiredness'],
    urgesPlan: ['order late-night food', 'make an impulse buy', 'send an angry message', 'put off a task'],
    alts: ['drink a glass of water and decide again in 10 minutes', 'leave it in the cart and look again tomorrow', 'save the message as a draft and walk for 10 minutes', 'set a 5-minute timer and start just the first line'],
    empty: 'Pick one feeling and one action.',
    label: (f: string) => `“Right now I'm feeling ${f}.”`,
    plan: (u: string, a: string) => `If I want to ${u}, then I will ${a}.`,
    note: 'A practice based on research showing that simply putting a feeling into one word reduced amygdala responses (Lieberman et al., 2007), plus research on implementation intentions.',
  },
  ja: {
    eyebrow: 'やってみる', title: '感情に名前をつけて、ひと呼吸おく',
    feel: '今感じている感情', urge: 'しようとしていた行動',
    feels: ['イライラ', '不安', 'さびしさ', '孤独', '空腹', '疲れ'],
    urges: ['夜食を頼む', '衝動買い', '怒りのメッセージを送る', 'やることを先のばしにする'],
    feelsObj: ['イライラ', '不安', 'さびしさ', '孤独', '空腹', '疲れ'],
    urgesPlan: ['夜食を頼み', '衝動買いをし', '怒りのメッセージを送り', 'やることを先のばしにし'],
    alts: ['水を1杯飲んで10分後にもう一度決める', 'カートに入れるだけにして明日もう一度見る', 'メッセージを下書き保存して10分歩く', 'タイマーを5分にして最初の1行だけ始める'],
    empty: '感情と行動をひとつずつ選んでみてください。',
    label: (f: string) => `「わたしは今、${f}を感じている。」`,
    plan: (u: string, a: string) => `もし${u}たくなったら、わたしは${a}。`,
    note: '感情をひとことで言うだけで扁桃体の反応が減ったという研究（Lieberman ほか、2007）と、実行意図の研究をもとにした練習です。',
  },
};

export default function NameIt({ lang = 'ko' }: { lang?: Lang }) {
  const t = T[lang];
  const [f, setF] = useState<number | null>(null);
  const [u, setU] = useState<number | null>(null);
  const chips = (list: string[], v: number | null, set: (i: number) => void, label: string) => (
    <div class="fw-choices" role="radiogroup" aria-label={label}>
      {list.map((x, i) => (
        <button type="button" role="radio" aria-checked={v === i} class={`bmap-chip${v === i ? ' is-on' : ''}`} onClick={() => set(i)}>{x}</button>
      ))}
    </div>
  );
  return (
    <div class="widget" data-widget="nameit">
      <p class="widget-eyebrow">{t.eyebrow}</p>
      <p class="widget-title">{t.title}</p>
      <p class="rs-progress">{t.feel}</p>
      {chips(t.feels, f, setF, t.feel)}
      <p class="rs-progress">{t.urge}</p>
      {chips(t.urges, u, setU, t.urge)}
      <div class={`woop-result${f !== null && u !== null ? ' is-ready' : ''}`} aria-live="polite">
        {f !== null && u !== null ? (
          <>
            <p class="ni-line">{t.label(t.feelsObj[f])}</p>
            <p class="ni-line">{t.plan(t.urgesPlan[u], t.alts[u])}</p>
          </>
        ) : <p class="ni-line">{t.empty}</p>}
      </div>
      <p class="widget-note">{t.note}</p>
    </div>
  );
}
