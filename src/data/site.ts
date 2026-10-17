export const SITE = {
  name: '믿음의 게임, 실행',
  slogan: '뇌와 마음, 그리고 습관 변화를 통한 삶의 긍정적 변화',
  description:
    '복잡한 뇌과학 정보를 쉽게 풀어, 오늘 바로 실천할 수 있는 팩트 기반 습관 정보를 전하는 뇌과학 아티클 사이트입니다.',
  email: 'warauego@naver.com',
  locale: 'ko_KR',
  // Formspree 폼 ID (https://formspree.io/f/XXXXXXXX 의 마지막 부분). 비워 두면 문의 폼이 메일 앱을 엽니다.
  formspreeId: '',
  // 구글 애널리틱스(GA4) 측정 ID (예: G-XXXXXXXXXX). 비워 두면 추적 코드를 넣지 않습니다.
  gaId: 'G-DBDFDGVKSY',
  // 구글 애드센스 게시자 ID (예: ca-pub-1234567890123456). 비워 두면 광고 스크립트와 광고 칸을 넣지 않습니다.
  adsenseClient: '',
  // 애드센스에서 만든 디스플레이 광고 단위의 슬롯 번호 (예: 1234567890)
  adSlots: { postTop: '', postBottom: '' },
};

export const NAV = [
  { href: '/', label: '아티클' },
  { href: '/blog/', label: '블로그' },
  { href: '/about/', label: '소개' },
  { href: '/contact/', label: '문의' },
];

export function minutesOfDay(time?: string) {
  if (!time) return null;
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

export function formatDate(d: Date) {
  return `${d.getFullYear()}. ${d.getMonth() + 1}. ${d.getDate()}.`;
}
