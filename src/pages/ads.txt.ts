// /ads.txt — 이 사이트에 광고를 팔 수 있는 판매자(구글 애드센스)를 밝히는 파일.
// public/에 직접 두지 않고 src/data/site.ts의 adsenseClient에서 만들어, 게시자 ID를 한 곳에서만 관리한다.
// 형식: google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0
//   (f08c47fec0942fa0은 구글 광고 시스템의 고정 인증 ID)
import type { APIRoute } from 'astro';
import { SITE } from '../data/site';

export const GET: APIRoute = () => {
  const pub = SITE.adsenseClient.trim().replace(/^ca-/, '');
  const body = pub.startsWith('pub-')
    ? `google.com, ${pub}, DIRECT, f08c47fec0942fa0\n`
    : '# 구글 애드센스 게시자 ID를 src/data/site.ts의 adsenseClient에 넣으면 이 파일이 자동으로 채워집니다.\n';
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
