/** @jsxImportSource preact */
// 건강검진 수치(중성지방·HDL·공복혈당·허리둘레)를 넣으면 인슐린 저항성과 관련된 기준선을 넘는지 보여 준다.
// 진단이 아니라 참고용이며, 입력값은 저장하거나 보내지 않는다. 화면에 보일 때만 스크립트를 붙인다(client:visible).
import { useState } from 'preact/hooks';
import './widgets.css';

type Lang = 'ko' | 'en' | 'ja';
type Sex = 'f' | 'm';

const T = {
  ko: {
    eyebrow: '직접 넣어 보기', title: '건강검진 수치로 보는 인슐린 저항성 신호',
    tg: '중성지방 (mg/dL)', hdl: 'HDL 콜레스테롤 (mg/dL)', glu: '공복혈당 (mg/dL)', waist: '허리둘레 (cm)',
    sex: '성별', f: '여성', m: '남성',
    ratio: (r: string) => `중성지방/HDL 비율 ${r}`,
    rows: {
      ratio: ['3.0 이상이면 인슐린 저항성과 관련이 컸습니다', '3.0 미만입니다'],
      glu: ['100~125는 공복혈당장애 범위입니다', '126 이상은 당뇨 기준에 해당할 수 있어 진료가 필요합니다', '100 미만입니다'],
      waist: (s: Sex) => [`복부비만 기준(${s === 'm' ? '남성 90' : '여성 85'}cm) 이상입니다`, `복부비만 기준(${s === 'm' ? '남성 90' : '여성 85'}cm) 미만입니다`],
    },
    empty: '검진표에 있는 숫자를 넣어 보세요. 비워 둔 항목은 건너뜁니다.',
    flagged: (n: number) => n ? `${n}개 항목이 기준선을 넘었습니다. 다음 진료 때 의사와 함께 확인해 보세요.` : '입력한 항목은 모두 기준선 안쪽입니다.',
    note: '진단 도구가 아닙니다. 비율 기준은 McLaughlin 외(2003), 허리둘레는 한국인 기준(Lee 외, 2007)을 따랐습니다. 입력한 숫자는 저장되지 않습니다.',
  },
  en: {
    eyebrow: 'Try it yourself', title: 'Insulin resistance signs from your checkup numbers',
    tg: 'Triglycerides (mg/dL)', hdl: 'HDL cholesterol (mg/dL)', glu: 'Fasting glucose (mg/dL)', waist: 'Waist (cm)',
    sex: 'Sex', f: 'Female', m: 'Male',
    ratio: (r: string) => `Triglyceride/HDL ratio ${r}`,
    rows: {
      ratio: ['A ratio of 3.0 or higher was strongly linked to insulin resistance', 'Below 3.0'],
      glu: ['100 to 125 is the impaired fasting glucose range', '126 or higher may meet the diabetes threshold; please see a doctor', 'Below 100'],
      waist: (s: Sex) => [`At or above the abdominal obesity cutoff for Koreans (${s === 'm' ? 'men 90' : 'women 85'} cm)`, `Below the abdominal obesity cutoff for Koreans (${s === 'm' ? 'men 90' : 'women 85'} cm)`],
    },
    empty: 'Enter the numbers from your checkup report. Blank items are skipped.',
    flagged: (n: number) => n ? `${n} ${n === 1 ? 'item is' : 'items are'} past the threshold. Go over them with your doctor at your next visit.` : 'Every item you entered is within the threshold.',
    note: 'This is not a diagnostic tool. The ratio threshold follows McLaughlin et al. (2003), and the waist cutoff follows the Korean standard (Lee et al., 2007); cutoffs differ by population. Nothing you enter is saved.',
  },
  ja: {
    eyebrow: '入力してみる', title: '健康診断の数値で見るインスリン抵抗性のサイン',
    tg: '中性脂肪（mg/dL）', hdl: 'HDLコレステロール（mg/dL）', glu: '空腹時血糖（mg/dL）', waist: '腹囲（cm）',
    sex: '性別', f: '女性', m: '男性',
    ratio: (r: string) => `中性脂肪/HDL比 ${r}`,
    rows: {
      ratio: ['3.0以上だとインスリン抵抗性との関係が強くなりました', '3.0未満です'],
      glu: ['100〜125は空腹時血糖異常の範囲です', '126以上は糖尿病の基準に当たる可能性があり、受診が必要です', '100未満です'],
      waist: (s: Sex) => [`韓国人の腹部肥満の基準（${s === 'm' ? '男性90' : '女性85'}cm）以上です`, `韓国人の腹部肥満の基準（${s === 'm' ? '男性90' : '女性85'}cm）未満です`],
    },
    empty: '健診結果の数字を入れてみてください。空欄の項目は飛ばします。',
    flagged: (n: number) => n ? `${n}項目が基準線をこえました。次の受診のときに医師といっしょに確かめてみてください。` : '入力した項目はすべて基準線の内側です。',
    note: '診断ツールではありません。比の基準はMcLaughlin ほか（2003）、腹囲は韓国人の基準（Lee ほか、2007）によります。日本の基準とは異なります。入力した数字は保存されません。',
  },
};

const num = (s: string) => { const n = parseFloat(s); return Number.isFinite(n) && n > 0 ? n : null; };

export default function MetaCheck({ lang = 'ko' }: { lang?: Lang }) {
  const t = T[lang];
  const [v, setV] = useState({ tg: '', hdl: '', glu: '', waist: '' });
  const [sex, setSex] = useState<Sex>('f');
  const tg = num(v.tg), hdl = num(v.hdl), glu = num(v.glu), waist = num(v.waist);
  const rows: { label: string; text: string; bad: boolean }[] = [];
  if (tg && hdl) {
    const r = tg / hdl;
    rows.push({ label: t.ratio(r.toFixed(1)), text: t.rows.ratio[r >= 3 ? 0 : 1], bad: r >= 3 });
  }
  if (glu) rows.push({ label: `${t.glu} ${glu}`, text: t.rows.glu[glu >= 126 ? 1 : glu >= 100 ? 0 : 2], bad: glu >= 100 });
  if (waist) {
    const cut = sex === 'm' ? 90 : 85;
    rows.push({ label: `${t.waist} ${waist}`, text: t.rows.waist(sex)[waist >= cut ? 0 : 1], bad: waist >= cut });
  }
  const bad = rows.filter((r) => r.bad).length;
  const field = (k: keyof typeof v, label: string) => (
    <label class="woop-field" for={`mc-${k}`}>
      <span>{label}</span>
      <input id={`mc-${k}`} type="number" inputMode="decimal" min="0" value={v[k]} onInput={(e) => setV({ ...v, [k]: (e.target as HTMLInputElement).value })} />
    </label>
  );
  return (
    <div class="widget" data-widget="metacheck">
      <p class="widget-eyebrow">{t.eyebrow}</p>
      <p class="widget-title">{t.title}</p>
      <div class="mc-grid">
        {field('tg', t.tg)}{field('hdl', t.hdl)}{field('glu', t.glu)}{field('waist', t.waist)}
      </div>
      <div class="fw-choices" role="radiogroup" aria-label={t.sex}>
        {(['f', 'm'] as Sex[]).map((s) => (
          <button type="button" role="radio" aria-checked={sex === s} class={`bmap-chip${sex === s ? ' is-on' : ''}`} onClick={() => setSex(s)}>{t[s]}</button>
        ))}
      </div>
      <div class="mc-result" aria-live="polite">
        {rows.length === 0 ? <p class="woop-result">{t.empty}</p> : (
          <>
            <ul class="mc-rows">
              {rows.map((r) => <li class={r.bad ? 'is-bad' : ''}><strong>{r.label}</strong><span>{r.text}</span></li>)}
            </ul>
            <p class="syn-caption">{t.flagged(bad)}</p>
          </>
        )}
      </div>
      <p class="widget-note">{t.note}</p>
    </div>
  );
}
