export const SITE = {
  name: '믿음의 게임, 실행',
  slogan: '뇌와 마음, 그리고 습관 변화를 통한 삶의 긍정적 변화',
  description:
    '복잡한 뇌과학 정보를 쉽게 풀어, 오늘 바로 실천할 수 있는 팩트 기반 습관 정보를 전하는 뇌과학 아티클 사이트입니다.',
  email: 'warauego@naver.com',
  locale: 'ko_KR',
  // 작성자: 모든 글의 바이라인과 JSON-LD author(Person), 소개 페이지의 '작성자 소개' 섹션(#author)이 이 값을 쓴다.
  // 학력 · 자격 · 직함은 운영자가 직접 확인해 준 것만 적는다 (지어내지 않는다)
  author: {
    anchor: 'author',
    name: { ko: '믿음의 게임, 실행 운영자', en: 'Editor of jes-lu.com', ja: 'jes-lu.com編集人' },
    byline: {
      ko: { text: '글 · 믿음의 게임, 실행 운영자 — 5년 차 도서관 사서 출신, 연구 자료를 찾아 쉽게 정리합니다', link: '작성자 소개 →', open: ' (', close: ')' },
      en: { text: 'By the editor of jes-lu.com — a former public librarian (5 years) who finds research and explains it plainly', link: 'About the author →', open: ' (', close: ')' },
      ja: { text: '文・jes-lu.com編集人 — 元公務員の図書館司書（5年）。研究資料を探し、わかりやすくまとめています', link: '著者について→', open: '（', close: '）' },
    },
  },
  // 글에 대표 이미지가 없을 때 공유 미리보기(og:image)에 쓰는 기본 이미지 (public/ 아래, 1200×630)
  ogImage: '/og-default.png',
  // Formspree 폼 ID (https://formspree.io/f/XXXXXXXX 의 마지막 부분). 비워 두면 문의 폼이 메일 앱을 엽니다.
  formspreeId: '',
  // 구글 애널리틱스(GA4) 측정 ID (예: G-XXXXXXXXXX). 비워 두면 추적 코드를 넣지 않습니다.
  gaId: 'G-DBDFDGVKSY',
  // 구글 애드센스 게시자 ID (예: ca-pub-1234567890123456). 이것 하나만 넣으면
  // <head> 공통 스크립트(심사 · 자동 광고), 사이트 확인 메타 태그, /ads.txt가 모두 자동으로 채워집니다.
  // 비워 두면 광고 관련 코드는 하나도 넣지 않습니다.
  adsenseClient: 'ca-pub-3240306370904077',
  // 글 페이지 광고 자리(4컷 만화 아래 · 본문 끝)에 쓸 디스플레이 광고 단위 번호 (예: 1234567890).
  // 비워 두면 그 자리는 비워 두고 자동 광고만 동작합니다.
  adSlots: { postTop: '', postBottom: '' },
};

export function minutesOfDay(time?: string) {
  if (!time) return null;
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

// 날짜는 빌드하는 서버의 시간대(Vercel은 UTC)와 상관없이 항상 한국 시간으로 센다.
// 그러지 않으면 한국 시간 오전 0~9시에 쓴 글이 하루 앞선 날짜로 보인다.
export const SITE_TZ = 'Asia/Seoul';
const seoulFormat = new Intl.DateTimeFormat('en-US', {
  timeZone: SITE_TZ, hourCycle: 'h23',
  year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric',
});

// 한국 시간 기준 연 · 월 · 일 · 시 · 분 · 초 (숫자)
export function seoulParts(d: Date) {
  const p = Object.fromEntries(seoulFormat.formatToParts(d).map((x) => [x.type, x.value]));
  return { y: +p.year, m: +p.month, d: +p.day, h: +p.hour, min: +p.minute, s: +p.second };
}

// 한국 시간으로 적은 ISO 날짜 (예: 2026-10-14T00:54:00+09:00). JSON-LD · <time datetime> · 사이트맵에 쓴다
export function seoulISO(d: Date) {
  const { y, m, d: day, h, min, s } = seoulParts(d);
  const two = (n: number) => String(n).padStart(2, '0');
  return `${y}-${two(m)}-${two(day)}T${two(h)}:${two(min)}:${two(s)}+09:00`;
}

export function formatDate(d: Date) {
  const { y, m, d: day } = seoulParts(d);
  return `${y}. ${m}. ${day}.`;
}
