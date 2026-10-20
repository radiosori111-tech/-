/** @jsxImportSource preact */
// 측정 시점(공복/식후 2시간)과 혈당 수치를 넣으면 일반적인 기준 범위 중 어디에 해당하는지 보여 준다.
// 가정용 측정기 값은 진단 기준이 아니므로 참고용 문구를 함께 띄운다. 아무것도 저장하지 않는다(client:visible).
import { useState } from 'preact/hooks';
import './widgets.css';

type Lang = 'ko' | 'en' | 'ja';
type When = 'fast' | 'post';

const T = {
  ko: {
    eyebrow: '직접 넣어 보기', title: '내 혈당 수치, 어느 범위일까?',
    when: '측정 시점', fast: '아침 공복', post: '식사 시작 2시간 뒤', value: '측정값 (mg/dL)',
    empty: '측정 시점을 고르고 수치를 넣어 보세요.',
    bands: {
      low: ['70 미만', '저혈당 범위입니다. 어지럽거나 식은땀이 나면 당분을 먹고, 반복되면 진료를 받으세요.'],
      fast: [['70~99', '정상 범위입니다.'], ['100~125', '공복혈당장애 범위입니다. 병원 검사로 확인해 보세요.'], ['126 이상', '당뇨 기준에 해당할 수 있습니다. 병원에서 정맥혈 검사를 받으세요.']],
      post: [['140 미만', '포도당 부하 검사 2시간 정상 기준(140 미만)에 해당합니다.'], ['140~199', '내당능장애 기준 범위입니다. 식사 구성과 식후 걷기를 점검해 보세요.'], ['200 이상', '당뇨 기준에 해당할 수 있습니다. 병원 진료를 받으세요.']],
    },
    note: '가정용 측정기 값은 진단 기준이 아니며, 국제 표준에서도 측정기마다 ±15% 정도의 오차를 허용합니다. 기준은 미국당뇨병학회(2024)를 따랐습니다.',
  },
  en: {
    eyebrow: 'Try it yourself', title: 'Where does my blood sugar reading fall?',
    when: 'When measured', fast: 'Morning, fasting', post: '2 hours after starting a meal', value: 'Reading (mg/dL)',
    empty: 'Choose when you measured and enter your reading.',
    bands: {
      low: ['Below 70', 'This is in the low blood sugar range. If you feel dizzy or sweaty, eat some sugar, and see a doctor if it keeps happening.'],
      fast: [['70–99', 'This is in the normal range.'], ['100–125', 'This is in the impaired fasting glucose range. Confirm it with a lab test.'], ['126 or higher', 'This may meet the diabetes threshold. Get a venous blood test at a clinic.']],
      post: [['Below 140', 'This falls under the normal 2-hour threshold of a glucose tolerance test (below 140).'], ['140–199', 'This is in the impaired glucose tolerance range. Review what you ate and try walking after meals.'], ['200 or higher', 'This may meet the diabetes threshold. Please see a doctor.']],
    },
    note: 'Home meter readings are not diagnostic, and international standards allow each meter an error of about ±15%. Thresholds follow the American Diabetes Association (2024).',
  },
  ja: {
    eyebrow: '入力してみる', title: '自分の血糖値、どの範囲？',
    when: '測ったタイミング', fast: '朝の空腹時', post: '食べはじめて2時間後', value: '測定値（mg/dL）',
    empty: '測ったタイミングを選び、数値を入れてみてください。',
    bands: {
      low: ['70未満', '低血糖の範囲です。めまいや冷や汗があれば糖分をとり、くり返すなら受診してください。'],
      fast: [['70〜99', '正常の範囲です。'], ['100〜125', '空腹時血糖異常の範囲です。病院の検査で確かめてみてください。'], ['126以上', '糖尿病の基準に当たる可能性があります。病院で静脈血の検査を受けてください。']],
      post: [['140未満', 'ブドウ糖負荷試験の2時間値の正常基準（140未満）に当たります。'], ['140〜199', '耐糖能異常の基準の範囲です。食事の内容と食後のウォーキングを見直してみましょう。'], ['200以上', '糖尿病の基準に当たる可能性があります。受診してください。']],
    },
    note: '家庭用の測定器の値は診断基準ではなく、国際規格でも測定器ごとに±15％ほどの誤差が認められています。基準は米国糖尿病学会（2024）によります。',
  },
};

export default function GlucoseReading({ lang = 'ko' }: { lang?: Lang }) {
  const t = T[lang];
  const [when, setWhen] = useState<When>('fast');
  const [raw, setRaw] = useState('');
  const n = parseFloat(raw);
  let band: string[] | null = null;
  let level = 0;
  if (Number.isFinite(n) && n > 0) {
    if (n < 70) { band = t.bands.low; level = 2; }
    else if (when === 'fast') { const i = n < 100 ? 0 : n < 126 ? 1 : 2; band = t.bands.fast[i]; level = i; }
    else { const i = n < 140 ? 0 : n < 200 ? 1 : 2; band = t.bands.post[i]; level = i; }
  }
  return (
    <div class="widget" data-widget="glucose-reading">
      <p class="widget-eyebrow">{t.eyebrow}</p>
      <p class="widget-title">{t.title}</p>
      <div class="fw-choices" role="radiogroup" aria-label={t.when}>
        {(['fast', 'post'] as When[]).map((w) => (
          <button type="button" role="radio" aria-checked={when === w} class={`bmap-chip${when === w ? ' is-on' : ''}`} onClick={() => setWhen(w)}>{t[w]}</button>
        ))}
      </div>
      <div class="woop-fields">
        <label class="woop-field" for="gr-value">
          <span>{t.value}</span>
          <input id="gr-value" type="number" inputMode="decimal" min="0" value={raw} onInput={(e) => setRaw((e.target as HTMLInputElement).value)} />
        </label>
      </div>
      <div class="mc-result" aria-live="polite">
        {band ? (
          <ul class="mc-rows"><li class={level >= 1 ? 'is-bad' : ''}><strong>{band[0]}</strong><span>{band[1]}</span></li></ul>
        ) : <p class="woop-result">{t.empty}</p>}
      </div>
      <p class="widget-note">{t.note}</p>
    </div>
  );
}
