/** @jsxImportSource preact */
// 짧은 독서 타이머. 읽는 동안 딴생각을 알아차리고 돌아올 때마다 버튼을 눌러 그 횟수를 센다.
// 돌아온 횟수를 '실패'가 아니라 '연습 횟수'로 보여 준다. 아무것도 저장하거나 보내지 않는다(client:visible).
import { useEffect, useRef, useState } from 'preact/hooks';
import './widgets.css';

type Lang = 'ko' | 'en' | 'ja';
const MINUTES = [5, 10, 15];

const T = {
  ko: {
    eyebrow: '직접 해 보기', title: '10분 집중 독서 타이머',
    pick: '읽을 시간', min: (n: number) => `${n}분`,
    start: '시작', pause: '잠시 멈춤', resume: '이어서', reset: '처음으로',
    back: '딴생각했다가 돌아왔어요', count: (n: number) => `돌아온 횟수 ${n}번`,
    idle: '시간을 고르고 시작을 누르세요. 휴대폰 알림은 꺼 두면 좋습니다.',
    running: '읽다가 딴생각이 난 걸 알아차리면, 책으로 돌아오면서 버튼을 눌러 주세요.',
    done: (n: number) => n === 0 ? '다 읽었습니다. 다음에는 딴생각을 알아차린 순간도 세어 보세요.' : `다 읽었습니다. 딴생각에서 ${n}번 돌아왔습니다. 그 한 번 한 번이 주의를 되돌리는 연습이었습니다.`,
    note: '딴생각을 알아차리고 돌아오는 순간에 주의와 관련된 뇌 영역이 활발해졌다는 명상 연구(Hasenkamp 외, 2012)를 독서에 적용한 연습 도구입니다.',
  },
  en: {
    eyebrow: 'Try it yourself', title: '10-minute focused reading timer',
    pick: 'Reading time', min: (n: number) => `${n} min`,
    start: 'Start', pause: 'Pause', resume: 'Resume', reset: 'Reset',
    back: 'My mind wandered, and I came back', count: (n: number) => `Times you came back: ${n}`,
    idle: 'Pick a time and press Start. It helps to silence phone notifications.',
    running: 'When you notice your mind has wandered, press the button as you return to the page.',
    done: (n: number) => n === 0 ? 'Done. Next time, try counting the moments you notice your mind wandering too.' : `Done. You came back from mind-wandering ${n} ${n === 1 ? 'time' : 'times'}. Each one was practice in bringing your attention back.`,
    note: 'A practice tool that applies a meditation study, which found attention-related brain regions grew active at the moment people noticed mind-wandering and returned (Hasenkamp et al., 2012), to reading.',
  },
  ja: {
    eyebrow: 'やってみる', title: '10分集中読書タイマー',
    pick: '読む時間', min: (n: number) => `${n}分`,
    start: 'スタート', pause: '一時停止', resume: '再開', reset: '最初から',
    back: '考えごとをして、戻ってきた', count: (n: number) => `戻った回数 ${n}回`,
    idle: '時間を選んでスタートを押してください。スマホの通知は切っておくと効果的です。',
    running: '読みながら考えごとをしていると気づいたら、本に戻るときにボタンを押してください。',
    done: (n: number) => n === 0 ? '読み終わりました。次は、考えごとに気づいた瞬間も数えてみましょう。' : `読み終わりました。考えごとから${n}回戻ってきました。その1回1回が、注意を引き戻す練習でした。`,
    note: '考えごとに気づいて戻る瞬間に注意にかかわる脳の領域が活発になったという瞑想の研究（Hasenkamp ほか、2012）を、読書に応用した練習ツールです。',
  },
};

export default function FocusTimer({ lang = 'ko' }: { lang?: Lang }) {
  const t = T[lang];
  const [mins, setMins] = useState(10);
  const [left, setLeft] = useState(10 * 60);
  const [state, setState] = useState<'idle' | 'running' | 'paused' | 'done'>('idle');
  const [backs, setBacks] = useState(0);
  const tick = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (state !== 'running') return;
    tick.current = window.setInterval(() => {
      setLeft((s) => {
        if (s <= 1) { setState('done'); return 0; }
        return s - 1;
      });
    }, 1000);
    return () => window.clearInterval(tick.current);
  }, [state]);

  const choose = (m: number) => { setMins(m); setLeft(m * 60); setState('idle'); setBacks(0); };
  const reset = () => { setLeft(mins * 60); setState('idle'); setBacks(0); };
  const mm = String(Math.floor(left / 60)).padStart(2, '0');
  const ss = String(left % 60).padStart(2, '0');
  const pct = 1 - left / (mins * 60);
  const msg = state === 'idle' ? t.idle : state === 'done' ? t.done(backs) : t.running;

  return (
    <div class="widget" data-widget="focus">
      <p class="widget-eyebrow">{t.eyebrow}</p>
      <p class="widget-title">{t.title}</p>
      <div class="fw-choices" role="radiogroup" aria-label={t.pick}>
        {MINUTES.map((m) => (
          <button type="button" role="radio" aria-checked={mins === m} class={`bmap-chip${mins === m ? ' is-on' : ''}`}
            disabled={state === 'running'} onClick={() => choose(m)}>{t.min(m)}</button>
        ))}
      </div>
      <div class="ft-clock" role="timer" aria-live="off">{mm}:{ss}</div>
      <div class="ft-bar" aria-hidden="true"><span style={{ width: `${pct * 100}%` }} /></div>
      <div class="woop-actions">
        {state === 'idle' && <button type="button" class="quiz-retry ft-main" onClick={() => setState('running')}>{t.start}</button>}
        {state === 'running' && <button type="button" class="quiz-retry" onClick={() => setState('paused')}>{t.pause}</button>}
        {state === 'paused' && <button type="button" class="quiz-retry ft-main" onClick={() => setState('running')}>{t.resume}</button>}
        {state !== 'idle' && <button type="button" class="quiz-retry" onClick={reset}>{t.reset}</button>}
      </div>
      <button type="button" class="quiz-option ft-back" disabled={state !== 'running'} onClick={() => setBacks((b) => b + 1)}>
        {t.back} <strong>{t.count(backs)}</strong>
      </button>
      <p class="syn-caption" aria-live="polite">{msg}</p>
      <p class="widget-note">{t.note}</p>
    </div>
  );
}
