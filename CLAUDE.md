# jes-lu.com 작업 지침

Astro 블로그(ko/en/ja). 글은 `src/content/blog/`(ko), `en/`, `ja/`에 있고 번역은 `translationOf`로 잇는다. 사실·경력 규칙은 `PRODUCT.md`를 따른다.

## 진행 방식
- 묻지 말고 바로 진행한다. 한 편씩, 쉬지 않고 다음 글로 넘어간다. **2026-10-23까지는 한 편이 끝나면 '계속'이라는 말을 기다리지 않고 자동으로 다음 글을 시작한다.** 작업하며 정한 세부 방식은 `지침.md`에 있다.
- 작업이 끝날 때마다 팝업(Artifact) 링크를 채팅에 적는다.
- 변경 후에는 `npm run build`로 확인하고 commit한다. **push는 글 1편의 작업(글·카드뉴스·비교 팝업)이 모두 끝났을 때 한 번만** 한다. 이 저장소는 Vercel 프로젝트 여러 개에 연결되어 있어 push마다 배포가 여러 번 일어나고, 하루 배포 한도("Deployment rate limited")에 걸리면 jes-lu.com이 24시간 동안 갱신되지 않는다(2026-10-20 실제로 발생). scripts·CLAUDE.md만 바뀐 커밋은 vercel.json의 ignoreCommand로 배포를 건너뛴다. 커밋 끝에 `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`를 붙인다.

## 진행 중인 일: 참고 문헌 없는 옛 글을 근거로 보강 (AdSense 승인용)
남은 글은 참고 문헌(`참고 문헌`)이 없는 ko 글이다. 2023년 글 3편은 모두 완료(간헐적 단식·BDNF 부족 원인·인슐린 역할). 남은 2026년 글은 date 순서로 진행한다: `grep -L "참고 문헌" src/content/blog/*.md*`를 date로 정렬해 맨 앞부터(러닝 무릎 통증·평발 러닝화·aMCC·카니보어 식단이란·독서 집중력·인슐린 저항성 자가체크·혈당 체크기·러닝 준비운동·후회할 행동·확언 효과·말버릇 고치는 법 글 완료. 다음: 매일-5분-습관-뇌가-진짜로-바뀌는-이유-따로-있었다-신경가소성 …).
- **push 보류 중**: 2026-10-20 배포 한도에 걸려, 한도가 풀리는 2026-10-21 낮 12시(12:07 예약)까지 commit만 쌓고 push하지 않는다. 풀리면 한 번에 push한다.
- 2023년 글: 전면 개정.
- 2026년 글(이미 김): 틀린 내용 바로잡기 + 참고 문헌 목록 + 한 줄 답 + 제목 점검 위주로 줄여서.
- 카드뉴스가 밀린 글 6편: BDNF-뇌-유래-신경영양인자-너의-정체는-뭐니, 플라세보가-진짜-존재하는지-알아보기, 성공의-비밀, 뇌가-변하고-있다, 두뇌활성이-필요한-중요한-날엔-직전에-뭘-먹을까, 육체적으로-이미-지쳤는데-…(피곤할 때 운동).

### 글 1편당 순서
1. ko 원글, en/ja 번역, 내부 링크 후보 slug를 읽는다.
2. 검색 의도를 정한다. 이미 고친 글과 같은 검색어가 겹치지 않게 한다.
3. ko 글을 다시 쓴다(아래 글쓰기 기준). slug와 date는 유지하고 `updated`를 갱신한다. 4컷 만화(`comic`) 캡션도 새 내용에 맞춘다.
   - **인터랙티브 위젯(MDX)을 글마다 1개 이상 넣는다**: 확인 퀴즈(`Quiz`)는 기본, 글에 맞으면 직접 해 보는 위젯(예: `WoopPlanner`, `SynapseSlider`, `BrainMap`, `FastingWindow`, 자가 점검표 `CheckList`는 items·tips를 props로 넘겨 어느 글에나 쓸 수 있음)을 쓰거나 `src/components/widgets/`에 새로 만든다(Preact, `client:visible`, ko/en/ja 문구). 파일을 `.mdx`로 바꾸고(`git mv`), frontmatter 바로 뒤에 import, `<!-- -->` 대신 `{/* related-link */}`, 본문에 `<`·`{` 글자를 쓰지 않는다. 빌드 뒤 preview 서버에서 위젯을 한 번 눌러 확인한다.
4. en, ja 파일을 같은 내용으로 다시 쓴다(위젯 import 경로는 `../../../components/...`).
5. `node scripts/rewrite/fix-bold.cjs "$PWD/src/content"`를 실행한 뒤 `npm run build`를 하고, 그 글의 내부 링크(`dist/<경로>/index.html` 존재)를 확인한다.
6. commit (push는 10단계에서 한 번에).
7. Before→After 비교: `scripts/rewrite/build-rewrite-preview.cjs`의 `posts` 맨 앞에 항목(slug, base=고치기 전 커밋, short, titleNote, changes)을 추가한다. `node scripts/rewrite/build-rewrite-preview.cjs "$PWD/exports/rewrite" "$PWD"`를 실행하고, `exports/rewrite/rewrite-preview.html`을 기존 팝업 https://claude.ai/artifact/8kirAfPea3XaQJ2KgDoR8Z 에 url로 게시한다.
8. 카드뉴스: `scripts/cardnews/data/<이름>.json`(6장)을 쓰고 `node scripts/cardnews/build.mjs scripts/cardnews/data/<이름>.json`을 실행한다. PNG 6장이 `../카드뉴스/<이름>/`에 자동 저장된다. 한 장을 열어 넘침과 겹침을 확인한다.
9. `exports/cardnews/<이름>.artifact.html`을 팝업으로 게시한다(`capabilities: {downloads: true}`, icon image). 카드뉴스 데이터를 커밋한다.
10. `git push`를 한 번 하고, 채팅에 보고한다: 팝업 링크(카드뉴스·비교), Before→After 표(제목·분량·참고 문헌 수), 바로잡은 사실, 다음 글. 그리고 곧바로 다음 글로 넘어간다.

## 글쓰기 기준
- 근거: Nature·Science·Cell·NEJM·PNAS 등 학술 논문. 출처 없는 수치, 가짜 경험·경력, '뇌과학자가 말하는' 같은 권위 표현을 쓰지 않는다. '아편', '마약', '충격', '반전' 같은 자극어도 쓰지 않는다.
- 운영자의 실제 경험은 살린다. 원글의 틀린 주장은 원 논문으로 바로잡고, 바로잡았다는 사실을 본문에 밝힌다.
- 구조: `## 📌 핵심 요약`(맨 위에 `> **한 줄 답:**`, en "The short answer", ja 「ひとことで答えると」) → `### 💬` 개인 경험 → `## Deep Dive`(질문형 소제목) → 정리 표 → `## 해결책` 3단계 + 표 → `## 결론` → FAQ 2개 → 📚 참고 문헌 → 💭 독자 질문 → ⚠️ 면책.
- 제목: 검색어를 앞에 둔 질문 + 본문 연구가 보여 준 의외의 결과(호기심형). 30자 안팎. 본문과 반드시 일치해야 한다. description은 답부터 시작한다.
- 표 안 문장도 존댓말(ko ~습니다, ja です・ます). 주요 용어는 굵게. 내부 링크는 2개 이상(`<!-- related-link -->` 문단 포함).

## 카드뉴스 기준
6장, 1080×1080, 다크+네온. 구성: 1 후킹 표지 → 2 문제 제기 → 3 핵심 메커니즘 → 4 연구 데이터 → 5 오늘의 실천 → 6 CTA(jes-lu.com, 저장·공유). 카피는 본문과 일치해야 하고, 연구 출처는 슬라이드 하단에 적는다. 채팅에는 슬라이드별 대본과 배경용 영문 AI 이미지 프롬프트를 함께 준다.
