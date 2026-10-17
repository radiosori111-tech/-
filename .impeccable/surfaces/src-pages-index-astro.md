---
version: 1
slug: "src-pages-index-astro"
primary_target: "src/pages/index.astro"
related_targets: ["src/pages/articles/[slug].astro","src/pages/about.astro","src/pages/contact.astro","src/pages/privacy.astro"]
---

# Surface brief: 믿음의 게임, 실행 (site-wide reading surfaces)

Scope: 홈(아티클 인덱스), 글 상세, 소개, 문의, 개인정보 처리방침, 404. Visitor mode: Read.
Audience/job: 뇌과학·습관에 관심 있는 한국어 일반 독자가 근거를 이해하고 오늘 할 행동을 얻음. 애드센스 심사자가 독창성·필수 페이지를 확인.
Constraints: 정적 Astro. 기존 글·텍스트·이미지·메뉴 구조는 한 글자도 바꾸지 않음(2026-10-17 사용자 지시). 운영자 경력 미기재. 광고 자리 고려. 반응형.
Redesign 2026-10-17: user took the standing exit (category standard, played straight) with reference https://autoschool.alphagogogo.com/ (its order, not its purple glow). Replaces the "하루의 궤적" world.

## Direction contract

THESIS: 정돈된 지식 매거진의 정석. 다크 네이비 프레임과 소프트 그레이 본문, Pretendard 한 서체의 정밀한 위계로 신뢰를 만든다. 보라 네온 그라데이션·글로우·아이브로 라벨 같은 AI 랜딩 기본값을 거부한다.

OWN-WORLD: 프레임 #0F141C(마스트헤드·푸터·도해) / 본문 바탕 #F6F7F9, 카드 #FFFFFF, 1px #E4E7EC 테두리와 오프셋 있는 옅은 그림자, 반경 14px(카드)·10px(버튼)·999px(필터 칩). 유일한 강조색 딥 틸 #0D7A6F(어두운 바탕에서는 #5FD0C0). Pretendard Variable 단일 서체, 제목 자간 -0.03em, 본문 18px/1.85, 숫자는 표 숫자.

STORY: 독자는 첫 화면에서 사이트의 약속(뇌를 이해하면 하루가 바뀐다)과 대표 글을 보고, 카테고리 칩으로 카드 그리드를 걸러 글을 고르며, 글에서는 목차 카드를 따라 근거 → 도해 → 오늘의 실행 순으로 끝까지 읽는다.

FIRST VIEWPORT: (홈) 네이비 프레임: 좌측 로고 내비, 좌 7칸 큰 제목과 슬로건, 우 5칸 대표 글 카드(한 단계 밝은 네이비 표면). 프레임 하단에 24시간 아티클 타임라인. 아래 그레이 영역에 '모든 아티클' 제목·카테고리 칩·3열 카드 그리드. 주 행동 = 대표 글 읽기. (글) 네이비 제목 영역에 카테고리 칩·제목·요약·메타, 그 아래 42rem 본문과 우측 고정 목차 카드, 스크롤 시 상단 진행 바.

FORM: canon (standing exit, category standard played straight); reference autoschool.alphagogogo.com. seed:baf33a14511d4c54

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Signature interaction
카테고리 칩을 누르면 칩 배경이 미끄러지듯 이동하고, 카드가 30ms 간격으로 짧게(220ms, 강한 ease-out) 떠오르며 다시 정렬됨. 버튼은 누를 때 scale(0.97). 복사·반응 시 하단 토스트가 아래에서 올라왔다가 사라짐. 글 페이지 진행 바는 읽은 만큼 틸로 차오르고 멈춘 자리에 깃발. reduced-motion에서는 이동 없이 투명도만.

## Unresolved
문의 폼 전송 수단(mailto), 반응 저장(로컬만), 애드센스 게시자 ID, GA 측정 ID.
