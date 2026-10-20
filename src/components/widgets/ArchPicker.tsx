/** @jsxImportSource preact */
// 젖은 발자국 모양 세 가지 중 하나를 고르면, 그 아치 유형의 특징과 러닝화를 신어 볼 때 확인할 점을 보여 준다.
// 진단이 아니라 참고용이며 아무것도 저장하지 않는다. 화면에 보일 때만 스크립트를 붙인다(client:visible).
import { useState } from 'preact/hooks';
import './widgets.css';

type Lang = 'ko' | 'en' | 'ja';
type Arch = 'flat' | 'normal' | 'high';
const ARCHES: Arch[] = ['flat', 'normal', 'high'];

const T = {
  ko: {
    eyebrow: '직접 골라 보기', title: '젖은 발자국, 어느 쪽과 비슷한가요?',
    names: { flat: '가운데가 거의 다 찍힘', normal: '안쪽이 완만하게 들어감', high: '가운데가 거의 끊김' },
    types: { flat: '평발(낮은 아치)에 가깝습니다', normal: '정상 아치에 가깝습니다', high: '요족(높은 아치)에 가깝습니다' },
    check: {
      flat: ['안정화를 신었을 때 아치 안쪽이 받쳐져 편하다면 좋은 선택입니다.', '불편하다면 억지로 신지 말고 뉴트럴화도 신어 보세요. 아치에 맞춘 신발이 부상을 줄이지는 못했습니다.'],
      normal: ['대부분의 뉴트럴화가 무난하지만, 결국 기준은 신었을 때의 편안함입니다.', '발볼과 뒤꿈치가 들뜨지 않는지 함께 확인하세요.'],
      high: ['쿠션이 넉넉하고 잘 휘어지는 신발이 편하게 느껴지는 경우가 많습니다.', '발목이 자주 접질린다면 바닥이 너무 높고 좁은 신발은 피하세요.'],
    },
    none: '발바닥을 물에 적셔 마른 종이 위에 서 본 뒤, 비슷한 모양을 눌러 보세요.',
    common: '어떤 유형이든, 여러 켤레 중 가장 편한 신발을 고르세요(Nigg 외, 2015).',
    note: '집에서 하는 발자국 확인은 참고용이며 진단이 아닙니다. 통증이 계속되면 전문가에게 보행 분석을 받아 보세요.',
  },
  en: {
    eyebrow: 'Try it yourself', title: 'Which does your wet footprint look like?',
    names: { flat: 'Middle almost fully printed', normal: 'Inner edge curves in gently', high: 'Middle almost broken' },
    types: { flat: 'Closer to a flat foot (low arch)', normal: 'Closer to a normal arch', high: 'Closer to a high arch' },
    check: {
      flat: ['If a stability shoe supports your inner arch and feels comfortable, it’s a good choice.', 'If it feels uncomfortable, don’t force it; try neutral shoes too. Arch-matched shoes didn’t reduce injuries.'],
      normal: ['Most neutral shoes will do, but in the end the standard is how comfortable they feel.', 'Also check that the sides and heel don’t pinch or slip.'],
      high: ['Well-cushioned, flexible shoes often feel more comfortable.', 'If you often roll your ankle, avoid shoes with a very high, narrow sole.'],
    },
    none: 'Wet the sole of your foot, stand on dry paper, then tap the shape that looks most similar.',
    common: 'Whatever your type, pick the most comfortable pair out of several (Nigg et al., 2015).',
    note: 'A footprint check at home is only a rough guide, not a diagnosis. If pain persists, get a gait analysis from a professional.',
  },
  ja: {
    eyebrow: '選んでみる', title: 'ぬれた足あと、どれに似ていますか？',
    names: { flat: '中央がほぼ全部つく', normal: '内側がゆるやかにくぼむ', high: '中央がほぼ途切れる' },
    types: { flat: '偏平足（低いアーチ）に近いです', normal: '正常なアーチに近いです', high: 'ハイアーチ（高いアーチ）に近いです' },
    check: {
      flat: ['安定性シューズをはいて土踏まずが支えられ快適なら、よい選択です。', '合わないなら無理にはかず、ニュートラルシューズも試してください。アーチに合わせたシューズでけがは減りませんでした。'],
      normal: ['たいていのニュートラルシューズで問題ありませんが、最後の基準ははいたときの快適さです。', '足の横やかかとが圧迫されたり浮いたりしないかも確かめましょう。'],
      high: ['クッションがたっぷりで、よく曲がるシューズが快適に感じられることが多いです。', '足首をよくひねるなら、底が高くて細すぎるシューズは避けましょう。'],
    },
    none: '足の裏を水でぬらして乾いた紙の上に立ち、似ている形を押してみてください。',
    common: 'どのタイプでも、何足かのなかでいちばん快適なシューズを選びましょう（Nigg ほか、2015）。',
    note: '自宅での足あとチェックは目安で、診断ではありません。痛みが続くときは専門家に歩行分析をしてもらいましょう。',
  },
};

// 발자국 실루엣: 앞발·뒤꿈치는 같고, 가운데(중족부)가 바깥쪽(오른쪽)에서 안쪽으로 얼마나 찍히는지만 유형마다 다르다.
const MID: Record<Arch, number> = { flat: 26, normal: 14, high: 4 };
function Foot({ arch }: { arch: Arch }) {
  const w = MID[arch];
  return (
    <svg viewBox="0 0 60 124" aria-hidden="true">
      <ellipse class="arch-print" cx="30" cy="36" rx="16" ry="22" />
      <ellipse class="arch-print" cx="33" cy="102" rx="12" ry="16" />
      <rect class="arch-print" x={44 - w} y="48" width={w} height="46" rx={Math.min(w / 2, 6)} />
      {[[19, 8, 4.5], [27, 6, 3.5], [34, 6, 3.2], [40, 8, 2.8], [45, 11, 2.5]].map(([cx, cy, r]) => <circle class="arch-print" cx={cx} cy={cy} r={r} />)}
    </svg>
  );
}

export default function ArchPicker({ lang = 'ko' }: { lang?: Lang }) {
  const t = T[lang];
  const [arch, setArch] = useState<Arch | null>(null);
  return (
    <div class="widget" data-widget="arch">
      <p class="widget-eyebrow">{t.eyebrow}</p>
      <p class="widget-title">{t.title}</p>
      <div class="arch-options" role="radiogroup" aria-label={t.title}>
        {ARCHES.map((a) => (
          <button type="button" role="radio" aria-checked={arch === a} class={`arch-option${arch === a ? ' is-on' : ''}`} onClick={() => setArch(a)}>
            <Foot arch={a} />
            <span>{t.names[a]}</span>
          </button>
        ))}
      </div>
      <div class="woop-result is-ready arch-result" aria-live="polite">
        {arch ? (
          <>
            <p class="check-tips-title">{t.types[arch]}</p>
            <ul>{t.check[arch].map((c) => <li>{c}</li>)}</ul>
            <p class="arch-common">{t.common}</p>
          </>
        ) : <p class="arch-common">{t.none}</p>}
      </div>
      <p class="widget-note">{t.note}</p>
    </div>
  );
}
