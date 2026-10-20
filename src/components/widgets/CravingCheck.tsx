/** @jsxImportSource preact */
// 충동 점수 재기 → 15분 걷기 → 다시 재기. 걷기 전후의 먹고 싶은 마음(0~10)을 비교해 보여 준다.
// 15분 빠르게 걷기가 단 음식 욕구를 줄였다는 실험(Ledochowski 외, 2015)을 직접 해 보는 도구. 아무것도 저장하지 않는다(client:visible).
import { useEffect, useRef, useState } from 'preact/hooks';
import './widgets.css';

type Lang = 'ko' | 'en' | 'ja';
const WALK = 15 * 60;

const T = {
  ko: {
    eyebrow: '직접 해 보기', title: '야식 충동, 15분 걷고 다시 재기',
    before: '지금 먹고 싶은 마음은 몇 점인가요?', after: '걷고 온 지금은 몇 점인가요?',
    low: '전혀 없음', high: '참기 어려움',
    start: '15분 걷기 시작', skip: '이미 다녀왔어요', reset: '다시 하기',
    walking: '빠르게 걸어 보세요. 숨이 조금 찰 정도면 충분합니다.',
    result: (b: number, a: number) => a < b ? `${b}점에서 ${a}점으로 ${b - a}점 줄었습니다. 같은 신호에 다른 보상을 준 셈입니다.` : a === b ? `${b}점 그대로입니다. 오늘은 물 한 잔 마시고 10분만 더 기다려 보세요.` : `${b}점에서 ${a}점으로 올랐습니다. 배가 정말 고프다면 단백질이 든 가벼운 간식을 고르세요.`,
    note: '15분 빠르게 걷기가 단 음식 욕구를 줄였다는 실험(Ledochowski 외, 2015)을 바탕으로 한 연습 도구입니다. 점수는 저장되지 않습니다.',
  },
  en: {
    eyebrow: 'Try it yourself', title: 'Late-night craving: walk 15 minutes, then rate again',
    before: 'How strong is your urge to eat right now?', after: 'How strong is it now that you’re back?',
    low: 'None', high: 'Hard to resist',
    start: 'Start a 15-minute walk', skip: 'I already went', reset: 'Start over',
    walking: 'Walk briskly. Being a little out of breath is enough.',
    result: (b: number, a: number) => a < b ? `It dropped ${b - a} points, from ${b} to ${a}. You gave the same cue a different reward.` : a === b ? `Still ${b}. Tonight, drink a glass of water and wait 10 more minutes.` : `It rose from ${b} to ${a}. If you’re truly hungry, choose a light snack with some protein.`,
    note: 'A practice tool based on an experiment where a 15-minute brisk walk reduced sugary snack cravings (Ledochowski et al., 2015). Scores are not saved.',
  },
  ja: {
    eyebrow: 'やってみる', title: '夜食の衝動、15分歩いてもう一度測る',
    before: '今、食べたい気持ちは何点ですか？', after: '歩いてきた今は何点ですか？',
    low: 'まったくない', high: 'がまんしにくい',
    start: '15分歩き始める', skip: 'もう歩いてきた', reset: 'やり直す',
    walking: '速めに歩いてみましょう。少し息が上がるくらいで十分です。',
    result: (b: number, a: number) => a < b ? `${b}点から${a}点へ、${b - a}点下がりました。同じきっかけに別のごほうびをあげたことになります。` : a === b ? `${b}点のままです。今日は水を1杯飲んで、あと10分待ってみましょう。` : `${b}点から${a}点に上がりました。本当におなかがすいているなら、たんぱく質を含む軽いおやつを選びましょう。`,
    note: '15分の速歩きで甘いものへの欲求が減ったという実験（Ledochowski ほか, 2015）にもとづく練習ツールです。点数は保存されません。',
  },
};

export default function CravingCheck({ lang = 'ko' }: { lang?: Lang }) {
  const t = T[lang];
  const [before, setBefore] = useState(6);
  const [after, setAfter] = useState(6);
  const [stage, setStage] = useState<'before' | 'walking' | 'after'>('before');
  const [left, setLeft] = useState(WALK);
  const tick = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (stage !== 'walking') return;
    tick.current = window.setInterval(() => {
      setLeft((s) => {
        if (s <= 1) { setStage('after'); return 0; }
        return s - 1;
      });
    }, 1000);
    return () => window.clearInterval(tick.current);
  }, [stage]);

  const toAfter = () => { setAfter(before); setStage('after'); };
  const reset = () => { setStage('before'); setLeft(WALK); setBefore(6); setAfter(6); };
  const mm = String(Math.floor(left / 60)).padStart(2, '0');
  const ss = String(left % 60).padStart(2, '0');

  return (
    <div class="widget" data-widget="craving">
      <p class="widget-eyebrow">{t.eyebrow}</p>
      <p class="widget-title">{t.title}</p>
      <label class="cc-row">
        <span>{t.before} <strong>{before}</strong></span>
        <input type="range" min={0} max={10} step={1} value={before} class="syn-range" disabled={stage !== 'before'}
          onInput={(e) => setBefore(Number((e.target as HTMLInputElement).value))} />
        <span class="cc-ends" aria-hidden="true"><span>{t.low}</span><span>{t.high}</span></span>
      </label>
      {stage === 'before' && (
        <div class="cc-actions">
          <button type="button" class="quiz-retry" onClick={() => setStage('walking')}>{t.start}</button>
          <button type="button" class="quiz-retry" onClick={toAfter}>{t.skip}</button>
        </div>
      )}
      {stage === 'walking' && (
        <>
          <div class="ft-clock" role="timer" aria-live="off">{mm}:{ss}</div>
          <div class="ft-bar" aria-hidden="true"><span style={{ width: `${(1 - left / WALK) * 100}%` }} /></div>
          <p class="quiz-feedback">{t.walking}</p>
          <div class="cc-actions"><button type="button" class="quiz-retry" onClick={toAfter}>{t.skip}</button></div>
        </>
      )}
      {stage === 'after' && (
        <>
          <label class="cc-row">
            <span>{t.after} <strong>{after}</strong></span>
            <input type="range" min={0} max={10} step={1} value={after} class="syn-range"
              onInput={(e) => setAfter(Number((e.target as HTMLInputElement).value))} />
            <span class="cc-ends" aria-hidden="true"><span>{t.low}</span><span>{t.high}</span></span>
          </label>
          <p class="quiz-feedback" aria-live="polite"><strong>{t.result(before, after)}</strong></p>
          <button type="button" class="quiz-retry" onClick={reset}>{t.reset}</button>
        </>
      )}
      <p class="widget-note">{t.note}</p>
    </div>
  );
}
