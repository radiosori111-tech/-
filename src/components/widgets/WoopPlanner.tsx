/** @jsxImportSource preact */
// WOOP(소망·결과·장애물·계획) 네 칸을 채우면 "만약 ~하면, 나는 ~한다" 실행 의도 문장을 만들어 준다.
// 입력은 이 브라우저에만 임시로 남고(localStorage), 서버로 보내지 않는다. 화면에 보일 때만 스크립트를 붙인다(client:visible).
import { useEffect, useState } from 'preact/hooks';
import './widgets.css';

type Lang = 'ko' | 'en' | 'ja';
type Key = 'wish' | 'outcome' | 'obstacle' | 'plan';
const KEYS: Key[] = ['wish', 'outcome', 'obstacle', 'plan'];

const T = {
  ko: {
    eyebrow: '직접 해 보기', title: '나의 WOOP 계획 만들기',
    labels: { wish: 'W 소망: 이루고 싶은 것', outcome: 'O 결과: 이루면 가장 좋은 점', obstacle: 'O 장애물: 나를 막는 내 안의 것', plan: 'P 계획: 그때 할 행동' },
    holders: { wish: '예: 아침에 30분 책 읽기', outcome: '예: 하루를 내가 주도한다는 느낌', obstacle: '예: 눈뜨자마자 휴대폰을 집는다', plan: '예: 휴대폰 대신 머리맡의 책을 편다' },
    empty: '네 칸을 채우면 여기에 나의 실행 문장이 만들어집니다.',
    sentence: (o: string, p: string) => `만약 ‘${o}’ 순간이 오면, 나는 ‘${p}’.`,
    copy: '문장 복사', copied: '복사했습니다', clear: '지우기',
    note: '입력한 내용은 이 브라우저에만 남고 어디로도 보내지 않습니다.',
  },
  en: {
    eyebrow: 'Try it', title: 'Build your WOOP plan',
    labels: { wish: 'W Wish: what you want to achieve', outcome: 'O Outcome: the best thing about achieving it', obstacle: 'O Obstacle: what inside you gets in the way', plan: 'P Plan: what you will do then (I will…)' },
    holders: { wish: 'e.g. Read for 30 minutes each morning', outcome: 'e.g. Feeling in charge of my day', obstacle: 'e.g. I grab my phone as soon as I wake up', plan: 'e.g. open the book by my pillow instead' },
    empty: 'Fill in all four boxes and your action sentence will appear here.',
    sentence: (o: string, p: string) => `If ${o}, then I will ${p}.`,
    copy: 'Copy sentence', copied: 'Copied', clear: 'Clear',
    note: 'What you type stays only in this browser and is never sent anywhere.',
  },
  ja: {
    eyebrow: 'やってみる', title: '自分のWOOPプランをつくる',
    labels: { wish: 'W 願い：かなえたいこと', outcome: 'O 成果：かなったときにいちばんうれしいこと', obstacle: 'O 障害：自分のなかの妨げになるもの', plan: 'P 計画：そのときにする行動' },
    holders: { wish: '例：朝30分本を読む', outcome: '例：一日を自分で動かしている感覚', obstacle: '例：目が覚めるとすぐスマホを手に取る', plan: '例：スマホのかわりに枕元の本を開く' },
    empty: '4つの欄を埋めると、ここに自分の行動の文ができあがります。',
    sentence: (o: string, p: string) => `もし「${o}」となったら、私は「${p}」。`,
    copy: '文をコピー', copied: 'コピーしました', clear: '消す',
    note: '入力した内容はこのブラウザだけに残り、どこにも送られません。',
  },
};

const STORE = 'jes-woop';
const blank = { wish: '', outcome: '', obstacle: '', plan: '' };

export default function WoopPlanner({ lang = 'ko' }: { lang?: Lang }) {
  const t = T[lang];
  const [v, setV] = useState<Record<Key, string>>(blank);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try { const saved = JSON.parse(localStorage.getItem(STORE) || 'null'); if (saved) setV({ ...blank, ...saved }); } catch {}
  }, []);
  const update = (k: Key, value: string) => {
    const next = { ...v, [k]: value };
    setV(next);
    setCopied(false);
    try { localStorage.setItem(STORE, JSON.stringify(next)); } catch {}
  };
  // 끝의 마침표는 문장 틀이 붙이므로 입력 끝의 마침표는 지운다
  const trim = (s: string) => s.trim().replace(/[.。]+$/, '').replace(/^I will /i, '');
  const ready = KEYS.every((k) => trim(v[k]));
  const sentence = ready ? t.sentence(trim(v.obstacle), trim(v.plan)) : '';

  const copy = async () => {
    try { await navigator.clipboard.writeText(sentence); setCopied(true); } catch { setCopied(false); }
  };

  return (
    <div class="widget" data-widget="woop">
      <p class="widget-eyebrow">{t.eyebrow}</p>
      <p class="widget-title">{t.title}</p>
      <div class="woop-fields">
        {KEYS.map((k) => (
          <label class="woop-field" for={`woop-${k}`}>
            <span>{t.labels[k]}</span>
            <input id={`woop-${k}`} type="text" maxLength={80} value={v[k]} placeholder={t.holders[k]}
              onInput={(e) => update(k, (e.target as HTMLInputElement).value)} />
          </label>
        ))}
      </div>
      <p class={`woop-result${ready ? ' is-ready' : ''}`} aria-live="polite">{ready ? sentence : t.empty}</p>
      <div class="woop-actions">
        <button type="button" class="quiz-retry" disabled={!ready} onClick={copy}>{copied ? t.copied : t.copy}</button>
        <button type="button" class="quiz-retry" onClick={() => { setV(blank); setCopied(false); try { localStorage.removeItem(STORE); } catch {} }}>{t.clear}</button>
      </div>
      <p class="widget-note">{t.note}</p>
    </div>
  );
}
