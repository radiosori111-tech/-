---
version: 1
slug: "src-pages-index-astro"
primary_target: "src/pages/index.astro"
related_targets: ["src/pages/articles/[slug].astro","src/pages/about.astro","src/pages/privacy.astro"]
---

# Surface brief: 믿음의 게임, 실행 (site-wide reading surfaces)

Scope: 홈(아티클 인덱스), 글 상세, 소개·문의, 개인정보 처리방침. Visitor mode: Read (홈 인덱스 포함).
Audience/job: 뇌과학·습관에 관심 있는 한국어 일반 독자가 근거를 이해하고 오늘 할 행동을 얻음. 애드센스 심사자가 독창성·필수 페이지를 확인.
Constraints: 정적 Astro, 운영자 경력 미기재(지어내지 말 것), 광고 자리 고려, 반응형.

## Direction contract

THESIS: 뇌는 하루의 시간을 따라 움직인다. 모든 글은 그 습관이 일어나는 시각(또는 '언제든')에 놓인다. 썸네일 카드 그리드와 이미지 슬라이더라는 블로그 기본 배열을 거부하고, 24시간 선 하나가 사이트의 지도가 된다.

OWN-WORLD: 밤 잉크 #0F1622가 마스트헤드·푸터 영역을 통째로 소유, 아침 종이 #F5F6F3가 본문 영역을 소유. 활성 상태는 오직 해의 호박색(#E9A23B, 텍스트용 짙은 변형) 하나. 표 숫자 시각 표기(07:00), 1px 헤어라인, 둥근 모서리 최소. 본문 한글 세리프, UI 산세리프.

STORY: 독자는 첫 화면에서 '뇌과학을 실행으로 바꾸는 사이트'임을 이해하고, 하루 띠에서 지금 자기 시간대의 글을 고르거나 카테고리로 거르며, 글에서는 근거→도해→오늘의 실행 순으로 읽고 끝까지 간다.

FIRST VIEWPORT: (홈) 상단 밤색 영역: 좌측 사이트명 내비, 큰 세리프 제목과 슬로건 좌측 7칸, 우측 5칸에 대표 글. 영역 하단을 가로지르는 24시간 띠, 글들이 시각 핀으로 꽂힘(클릭 시 해당 글). 밝은 영역 시작에 카테고리 필터와 글 목록. 주 행동 = 대표 글 읽기. (글) 밤색 제목 영역에 시각·카테고리·읽기 시간, 본문 칼럼 65ch, 우측 고정 목차, 상단 읽기 진행선은 같은 24시간 선 문법.

FORM: 일주기 리듬 차트/수면 다이어리 — 내 목록 5번째(배정). 기증: 하나의 기하(곡선 접힘), 상태는 표시(편집대: 다 읽음 체크·멈춘 자리 깃발), 글마다 도해 하나(진), 색이 영역 소유(지도), 광원 하나(판화). seed:9a0b97074ef6b318

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Signature interaction
24시간 띠: 홈에서 현재 시각에 '지금' 표시가 서고 가장 가까운 글 핀이 활성화. 글 페이지 상단의 진행선이 읽은 만큼 호박색으로 차오르고, 떠났다 돌아오면 멈춘 자리에 깃발(localStorage). 모션은 이 하나: 지수 감속으로 띠가 그려짐, reduced-motion 시 정지 상태.

## Unresolved
문의 폼 전송 수단(현재 mailto 작성 + 이메일 표기), 반응 버튼 저장(로컬만), 배포처, 애드센스 게시자 ID.
