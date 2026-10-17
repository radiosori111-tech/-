// 4컷 만화 그림 목록 (Scene.astro가 그린다). 글 frontmatter의 comic.panels[].scene에 이 이름을 쓴다.
export const SCENES = [
  'alarm',     // 긴장 · 마감 앞의 책상, 울리는 경보
  'tired',     // 지침 · 번아웃, 바닥난 배터리
  'phone',     // 스마트폰 · 알림, 자극적인 습관
  'metronome', // 뇌간의 리듬이 경보실과 이어진 배선
  'synapse',   // 두 신경세포가 이어지는 순간 (가소성 · 헵의 법칙)
  'sprout',    // 뇌에서 돋아나는 새싹 (BDNF · 성장)
  'clean',     // 뇌의 노폐물이 빠져나가는 길 (글림프 · 면역 청소)
  'gut',       // 장과 뇌를 잇는 길 (장-뇌 축)
  'shield',    // 방어막 (면역 · IgA)
  'glucose',   // 혈당 한 방울과 측정기 (인슐린)
  'loop',      // 신호 → 행동 → 보상의 고리 (습관 · 반사)
  'pause',     // 자극과 반응 사이의 짧은 틈
  'sigh',      // 두 번 들숨, 긴 날숨
  'run',       // 달리기
  'lift',      // 근력 운동
  'nature',    // 숲 산책
  'sunrise',   // 아침 햇빛이 눈으로 들어오는 장면
  'sleep',     // 잠
  'food',      // 식사 · 식단
  'book',      // 독서 · 기록
  'speech',    // 말 · 혼잣말 · 확언
  'focus',     // 몰입 · 번뜩이는 생각
  'steps',     // 계단을 오르는 작은 반복, 목표 깃발
  'shoe',      // 러닝화와 발 아치
  'calm',      // 잦아든 경보, 고른 파형
] as const;

export type Scene = (typeof SCENES)[number];
