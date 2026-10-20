/** @jsxImportSource preact */
// 첫 끼 시각과 식사 창 길이를 고르면 하루 24시간 중 먹는 시간과 공복 시간을 막대로 보여 준다.
// 계산만 하고 아무것도 저장하거나 보내지 않는다. 화면에 보일 때만 스크립트를 붙인다(client:visible).
import { useState } from 'preact/hooks';
import './widgets.css';

type Lang = 'ko' | 'en' | 'ja';
const WINDOWS = [12, 10, 8];

const T = {
  ko: {
    eyebrow: '직접 정해 보기', title: '나의 식사 시간 정하기',
    first: '첫 끼 시각', window: '먹는 시간', eat: '먹는 시간', fast: '공복',
    hours: (n: number) => `${n}시간`,
    clock: (h: number) => `${h < 12 ? '오전' : '오후'} ${h % 12 === 0 ? 12 : h % 12}시`,
    summary: (a: string, b: string, f: number) => `${a}부터 ${b}까지 먹고, ${f}시간 공복을 둡니다.`,
    early: '식사가 오후 일찍 끝나는 일정입니다. 같은 양을 먹고도 이른 시간에만 먹었을 때 인슐린 민감도가 좋아진 소규모 연구가 있습니다(Sutton 외, 2018).',
    late: '마지막 끼니가 밤늦게 끝납니다. 잠들기 2~3시간 전에는 식사를 마치는 편이 생활 리듬을 지키기 쉽습니다.',
    mid: '처음이라면 12시간부터 시작해 몸이 익숙해지면 줄여 보세요. 감량을 결정한 것은 시간보다 먹은 양이었습니다(Liu 외, 2022).',
    note: '시간을 정하는 도구일 뿐, 특정 시간이 더 효과적이라는 뜻은 아닙니다. 당뇨약을 드시거나 임신·수유 중이라면 먼저 의사와 상의하세요.',
  },
  en: {
    eyebrow: 'Try it yourself', title: 'Set your eating window',
    first: 'First meal', window: 'Eating window', eat: 'Eating', fast: 'Fasting',
    hours: (n: number) => `${n} hours`,
    clock: (h: number) => `${h % 12 === 0 ? 12 : h % 12} ${h < 12 ? 'a.m.' : 'p.m.'}`,
    summary: (a: string, b: string, f: number) => `Eat from ${a} to ${b}, then fast for ${f} hours.`,
    early: 'Your eating ends early in the afternoon. In a small study, people who ate the same food but only early in the day became more insulin sensitive (Sutton et al., 2018).',
    late: 'Your last meal ends late at night. Finishing eating two to three hours before bed makes it easier to keep a steady daily rhythm.',
    mid: 'If you are new to this, start with 12 hours and shorten the window once you are used to it. What drove weight loss was how much people ate, not the clock (Liu et al., 2022).',
    note: 'This only helps you set a schedule; it does not mean any particular window works better. If you take diabetes medication or are pregnant or breastfeeding, talk to your doctor first.',
  },
  ja: {
    eyebrow: '決めてみる', title: '自分の食事時間を決める',
    first: '最初の食事', window: '食べる時間', eat: '食べる時間', fast: '空腹',
    hours: (n: number) => `${n}時間`,
    clock: (h: number) => `${h < 12 ? '午前' : '午後'}${h % 12 === 0 ? 12 : h % 12}時`,
    summary: (a: string, b: string, f: number) => `${a}から${b}まで食べ、${f}時間の空腹をおきます。`,
    early: '食事が午後の早い時間に終わる日程です。同じ量を食べても早い時間だけに食べたとき、インスリン感受性がよくなった小規模な研究があります（Sutton ほか、2018）。',
    late: '最後の食事が夜遅くに終わります。寝る2〜3時間前までに食事を終えるほうが、生活のリズムを守りやすくなります。',
    mid: 'はじめてなら12時間から始め、体が慣れたら短くしてみてください。減量を決めたのは時間より食べた量でした（Liu ほか、2022）。',
    note: '時間を決めるための道具で、特定の時間がより効果的という意味ではありません。糖尿病の薬を飲んでいる方や妊娠・授乳中の方は、まず医師に相談してください。',
  },
};

export default function FastingWindow({ lang = 'ko' }: { lang?: Lang }) {
  const t = T[lang];
  const [start, setStart] = useState(10);
  const [len, setLen] = useState(10);
  const end = (start + len) % 24;
  const fast = 24 - len;
  const tip = start + len <= 16 ? t.early : start + len >= 21 ? t.late : t.mid;
  // 24시간 막대: 0시가 왼쪽 끝. 자정을 넘기는 창은 두 조각으로 나눠 그린다.
  const segs = start + len <= 24 ? [[start, len]] : [[start, 24 - start], [0, start + len - 24]];
  return (
    <div class="widget" data-widget="fasting">
      <p class="widget-eyebrow">{t.eyebrow}</p>
      <p class="widget-title">{t.title}</p>
      <div class="syn-controls">
        <div class="syn-row"><label for="fw-start">{t.first}</label><strong>{t.clock(start)}</strong></div>
        <input id="fw-start" class="syn-range" type="range" min={5} max={14} step={1} value={start}
          onInput={(e) => setStart(Number((e.target as HTMLInputElement).value))} />
      </div>
      <div class="fw-choices" role="radiogroup" aria-label={t.window}>
        {WINDOWS.map((w) => (
          <button type="button" role="radio" aria-checked={len === w} class={`bmap-chip${len === w ? ' is-on' : ''}`} onClick={() => setLen(w)}>
            {t.window} {t.hours(w)}
          </button>
        ))}
      </div>
      <figure class="fw-figure">
        <svg viewBox="0 0 480 64" role="img" aria-label={t.summary(t.clock(start), t.clock(end), fast)}>
          <rect class="fw-fast" x="0" y="8" width="480" height="32" rx="8" />
          {segs.map(([s, l]) => <rect class="fw-eat" x={s * 20} y="8" width={l * 20} height="32" rx="8" />)}
          {[0, 6, 12, 18, 24].map((h) => (
            <text class="syn-label" x={Math.min(Math.max(h * 20, 8), 472)} y="60" text-anchor="middle">{h}</text>
          ))}
        </svg>
      </figure>
      <div class="fw-legend"><span><i class="fw-dot fw-dot-eat" />{t.eat} {t.hours(len)}</span><span><i class="fw-dot" />{t.fast} {t.hours(fast)}</span></div>
      <p class="woop-result is-ready" aria-live="polite">{t.summary(t.clock(start), t.clock(end), fast)}</p>
      <p class="syn-caption">{tip}</p>
      <p class="widget-note">{t.note}</p>
    </div>
  );
}
