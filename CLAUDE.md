# jes-lu.com 작업 지침

Astro 블로그(ko/en/ja). 글은 `src/content/blog/`(ko), `en/`, `ja/`에 있고 번역은 `translationOf`로 잇는다. 사실·경력 규칙은 `PRODUCT.md`를 따른다.

## 진행 방식
- 묻지 말고 바로 진행한다. 한 편씩, 쉬지 않고 다음 글로 넘어간다.
- 작업이 끝날 때마다 팝업(Artifact) 링크를 채팅에 적는다.
- 변경 후에는 `npm run build`로 확인하고 commit, push한다. 커밋 끝에 `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`를 붙인다.

## 진행 중인 일: 참고 문헌 없는 옛 글을 근거로 보강 (AdSense 승인용)
남은 글은 참고 문헌(`참고 문헌`)이 없는 ko 글이다. 순서: 2023년 글(기억은-덜-진실하다-그러니-기록하자 → 목표-이루는-방법-3가지 → 간헐적-단식-설-명절-확찐자들을-위한-비법 → BDNF-부족하게-되는-원인-뇌건강도-좋아지나 → 인슐린-역할은-영리하게-사용하는-비법은) → 2026년 9~10월 글.
- 2023년 글: 전면 개정.
- 2026년 글(이미 김): 틀린 내용 바로잡기 + 참고 문헌 목록 + 한 줄 답 + 제목 점검 위주로 줄여서.
- 카드뉴스가 밀린 글 6편: BDNF-뇌-유래-신경영양인자-너의-정체는-뭐니, 플라세보가-진짜-존재하는지-알아보기, 성공의-비밀, 뇌가-변하고-있다, 두뇌활성이-필요한-중요한-날엔-직전에-뭘-먹을까, 육체적으로-이미-지쳤는데-…(피곤할 때 운동).

### 글 1편당 순서
1. ko 원글, en/ja 번역, 내부 링크 후보 slug를 읽는다.
2. 검색 의도를 정한다. 이미 고친 글과 같은 검색어가 겹치지 않게 한다.
3. ko 글을 다시 쓴다(아래 글쓰기 기준). slug와 date는 유지하고 `updated`를 갱신한다. 4컷 만화(`comic`) 캡션도 새 내용에 맞춘다.
4. en, ja 파일을 같은 내용으로 다시 쓴다.
5. `node scripts/rewrite/fix-bold.cjs "$PWD/src/content"`를 실행한 뒤 `npm run build`를 하고, 그 글의 내부 링크(`dist/<경로>/index.html` 존재)를 확인한다.
6. commit, push.
7. Before→After 비교: `scripts/rewrite/build-rewrite-preview.cjs`의 `posts` 맨 앞에 항목(slug, base=고치기 전 커밋, short, titleNote, changes)을 추가한다. `node scripts/rewrite/build-rewrite-preview.cjs "$PWD/exports/rewrite" "$PWD"`를 실행하고, `exports/rewrite/rewrite-preview.html`을 기존 팝업 https://claude.ai/artifact/8kirAfPea3XaQJ2KgDoR8Z 에 url로 게시한다.
8. 카드뉴스: `scripts/cardnews/data/<이름>.json`(6장)을 쓰고 `node scripts/cardnews/build.mjs scripts/cardnews/data/<이름>.json`을 실행한다. PNG 6장이 `../카드뉴스/<이름>/`에 자동 저장된다. 한 장을 열어 넘침과 겹침을 확인한다.
9. `exports/cardnews/<이름>.artifact.html`을 팝업으로 게시한다(`capabilities: {downloads: true}`, icon image). 카드뉴스 데이터를 커밋한다.
10. 채팅에 보고한다: 팝업 링크(카드뉴스·비교), Before→After 표(제목·분량·참고 문헌 수), 바로잡은 사실, 다음 글. 그리고 곧바로 다음 글로 넘어간다.

## 글쓰기 기준
- 근거: Nature·Science·Cell·NEJM·PNAS 등 학술 논문. 출처 없는 수치, 가짜 경험·경력, '뇌과학자가 말하는' 같은 권위 표현을 쓰지 않는다. '아편', '마약', '충격', '반전' 같은 자극어도 쓰지 않는다.
- 운영자의 실제 경험은 살린다. 원글의 틀린 주장은 원 논문으로 바로잡고, 바로잡았다는 사실을 본문에 밝힌다.
- 구조: `## 📌 핵심 요약`(맨 위에 `> **한 줄 답:**`, en "The short answer", ja 「ひとことで答えると」) → `### 💬` 개인 경험 → `## Deep Dive`(질문형 소제목) → 정리 표 → `## 해결책` 3단계 + 표 → `## 결론` → FAQ 2개 → 📚 참고 문헌 → 💭 독자 질문 → ⚠️ 면책.
- 제목: 검색어를 앞에 둔 질문 + 본문 연구가 보여 준 의외의 결과(호기심형). 30자 안팎. 본문과 반드시 일치해야 한다. description은 답부터 시작한다.
- 표 안 문장도 존댓말(ko ~습니다, ja です・ます). 주요 용어는 굵게. 내부 링크는 2개 이상(`<!-- related-link -->` 문단 포함).

## 카드뉴스 기준
6장, 1080×1080, 다크+네온. 구성: 1 후킹 표지 → 2 문제 제기 → 3 핵심 메커니즘 → 4 연구 데이터 → 5 오늘의 실천 → 6 CTA(jes-lu.com, 저장·공유). 카피는 본문과 일치해야 하고, 연구 출처는 슬라이드 하단에 적는다. 채팅에는 슬라이드별 대본과 배경용 영문 AI 이미지 프롬프트를 함께 준다.
