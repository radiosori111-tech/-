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
  // 구글 애드센스 게시자 ID (예: ca-pub-1234567890123456). 이것 하나만 넣으면
  // <head> 공통 스크립트(심사 · 자동 광고), 사이트 확인 메타 태그, /ads.txt가 모두 자동으로 채워집니다.
  // 비워 두면 광고 관련 코드는 하나도 넣지 않습니다.
  adsenseClient: '',
  // 글 페이지 광고 자리(4컷 만화 아래 · 본문 끝)에 쓸 디스플레이 광고 단위 번호 (예: 1234567890).
  // 비워 두면 그 자리는 비워 두고 자동 광고만 동작합니다.
  adSlots: { postTop: '', postBottom: '' },
};

export function minutesOfDay(time?: string) {
  if (!time) return null;
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

export function formatDate(d: Date) {
  return `${d.getFullYear()}. ${d.getMonth() + 1}. ${d.getDate()}.`;
}
