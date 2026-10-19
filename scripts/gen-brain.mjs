// 프레임 배경의 빛나는 뇌(public/cosmos-brain.svg)를 만든다.
// 대뇌 주름은 반응-확산(Gray-Scott) 미로 무늬로 기르고, 그 높이로 음영을 넣은 질감을 WebP로 SVG에 담는다.
// 실행: node scripts/gen-brain.mjs
import { writeFileSync } from 'node:fs';
import sharp from 'sharp';

const W = 640, H = 460, S = 2; // 질감은 2배 해상도
const CELL = 1.4; // 시뮬레이션 한 칸 = 1.4px, 주름 폭이 이 값을 따른다
const GW = Math.round(W / CELL), GH = Math.round(H / CELL);

// 옆에서 본 뇌, 왼쪽이 앞(전두엽)
const CER = 'M118 246C96 170 152 88 238 68C310 46 392 50 452 86C522 126 552 198 528 258C512 302 470 324 430 320C412 346 370 356 338 340C304 360 252 354 226 330C176 336 132 302 118 246Z';
const CEREB = 'M412 318C442 330 486 322 500 296C516 330 488 370 444 370C418 368 402 350 412 318Z';
const STEM = 'M378 336C386 366 384 398 374 430C384 436 396 436 404 430C406 398 410 366 412 336Z';
const SYLVIAN = 'M196 282C236 262 272 250 310 238C350 226 380 214 404 192';

// 곡선을 다각형으로 펴서 안쪽 판정에 쓴다
function polygon(d) {
  const nums = d.match(/-?\d+(\.\d+)?/g).map(Number);
  const pts = [[nums[0], nums[1]]];
  let cur = pts[0];
  for (let i = 2; i + 5 < nums.length; i += 6) {
    const c1 = [nums[i], nums[i + 1]], c2 = [nums[i + 2], nums[i + 3]], e = [nums[i + 4], nums[i + 5]];
    for (let t = 0.04; t <= 1.0001; t += 0.04) {
      const u = 1 - t;
      pts.push([0, 1].map((k) => u * u * u * cur[k] + 3 * u * u * t * c1[k] + 3 * u * t * t * c2[k] + t * t * t * e[k]));
    }
    cur = e;
  }
  return pts;
}
const inside = (poly, x, y) => {
  let c = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i], [xj, yj] = poly[j];
    if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) c = !c;
  }
  return c;
};
const cerPoly = polygon(CER), cerebPoly = polygon(CEREB);

// ── Gray-Scott 미로 무늬 ──
let seed = 11;
const rnd = () => ((seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0) / 4294967296);
const n = GW * GH;
let u = new Float32Array(n).fill(1), v = new Float32Array(n);
// 4×4 씨앗을 고르게 뿌려야 무늬가 사라지지 않고 미로로 자란다
for (let k = 0; k < Math.round(n / 120); k++) {
  const cx = Math.floor(rnd() * GW), cy = Math.floor(rnd() * GH);
  for (let dy = 0; dy < 4; dy++) for (let dx = 0; dx < 4; dx++) {
    const i = ((cy + dy) % GH) * GW + ((cx + dx) % GW);
    u[i] = 0.5 + rnd() * 0.05; v[i] = 0.25 + rnd() * 0.05;
  }
}
const F = 0.029, K = 0.057, DU = 1.0, DV = 0.5;
let u2 = new Float32Array(n), v2 = new Float32Array(n);
const AX = new Float32Array(n), AY = new Float32Array(n);
for (let y = 0; y < GH; y++) for (let x = 0; x < GW; x++) {
  const wx = x * CELL, wy = y * CELL;
  const below = wy > 300 - (wx - 190) * 0.42; // 외측고랑 아래 = 측두엽
  const t = below ? 1 : wx < 200 ? 0.5 : 0; // 앞이마는 섞인 방향
  AX[y * GW + x] = 1 + 0.32 * (t * 2 - 1);
  AY[y * GW + x] = 1 - 0.32 * (t * 2 - 1);
}
for (let step = 0; step < 9000; step++) {
  for (let y = 0; y < GH; y++) {
    const ym = ((y - 1 + GH) % GH) * GW, yp = ((y + 1) % GH) * GW, yc = y * GW;
    for (let x = 0; x < GW; x++) {
      const xm = (x - 1 + GW) % GW, xp = (x + 1) % GW, i = yc + x;
      const ax = AX[i], ay = AY[i];
      const lu = ax * (u[yc + xm] + u[yc + xp] - 2 * u[i]) + ay * (u[ym + x] + u[yp + x] - 2 * u[i]);
      const lv = ax * (v[yc + xm] + v[yc + xp] - 2 * v[i]) + ay * (v[ym + x] + v[yp + x] - 2 * v[i]);
      const uvv = u[i] * v[i] * v[i];
      u2[i] = u[i] + 0.2 * lu * DU - uvv + F * (1 - u[i]);
      v2[i] = v[i] + 0.2 * lv * DV + uvv - (F + K) * v[i];
    }
  }
  [u, u2] = [u2, u]; [v, v2] = [v2, v];
}

// 격자 → 질감 해상도로 부드럽게 보간
const TW = W * S, TH = H * S;
const field = (px, py) => {
  const gx = Math.min(GW - 1.001, Math.max(0, px / S / CELL)), gy = Math.min(GH - 1.001, Math.max(0, py / S / CELL));
  const x0 = Math.floor(gx), y0 = Math.floor(gy), fx = gx - x0, fy = gy - y0;
  const a = v[y0 * GW + x0], b = v[y0 * GW + x0 + 1], c = v[(y0 + 1) * GW + x0], d = v[(y0 + 1) * GW + x0 + 1];
  return (a * (1 - fx) + b * fx) * (1 - fy) + (c * (1 - fx) + d * fx) * fy;
};

const sylPoly = polygon(SYLVIAN.replace('M190 262C', 'M190 262C'));
const distTo = (poly, x, y) => { let m = 1e9; for (let i = 1; i < poly.length; i++) { const [ax, ay] = poly[i - 1], [bx, by] = poly[i]; const dx = bx - ax, dy = by - ay; const t = Math.max(0, Math.min(1, ((x - ax) * dx + (y - ay) * dy) / (dx * dx + dy * dy))); m = Math.min(m, Math.hypot(x - ax - t * dx, y - ay - t * dy)); } return m; };
const ss = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
// 이랑 높이: 고랑은 좁고 이랑은 둥글게
const hOf = (x, y) => ss(0.4, 0.22, field(x, y));
// ── 음영 질감 ──
const px = Buffer.alloc(TW * TH * 4);
const mix = (a, b, t) => a.map((x, i) => x + (b[i] - x) * t);
const SULCUS = [58, 26, 104], GYRUS = [246, 200, 242], RIM = [150, 236, 228], CORE = [255, 236, 226];
for (let y = 0; y < TH; y++) {
  for (let x = 0; x < TW; x++) {
    const wx = x / S, wy = y / S;
    const inCer = inside(cerPoly, wx, wy), inCereb = !inCer && inside(cerebPoly, wx, wy);
    if (!inCer && !inCereb) continue;
    let h, hx, hy;
    if (inCer) {
      const e = 1.2;
      h = hOf(x, y);
      hx = hOf(x + e, y) - hOf(x - e, y);
      hy = hOf(x, y + e) - hOf(x, y - e);
      const ds = distTo(sylPoly, wx, wy); // 외측고랑은 깊고 어둡게
      h *= 0.4 + 0.6 * ss(1, 5.5, ds);
    } else {
      // 소뇌: 가로로 촘촘한 잎 무늬
      const k = (wy + ((wx - 455) ** 2) / 120) * 0.95;
      h = 0.5 + 0.5 * Math.sin(k);
      hx = 0; hy = Math.cos(k) * 0.5;
    }
    const light = Math.max(0, Math.min(1, 0.5 - 1.4 * hx - 1.6 * hy + 0.3 * h));
    const dc = Math.min(1.2, Math.hypot((wx - 318) / 215, (wy - 200) / 140));
    let col = mix(SULCUS, GYRUS, Math.min(1, h * 0.8 + light * 0.35));
    col = mix(col, CORE, Math.max(0, 0.5 - dc) * 0.8 * h);
    col = mix(col, RIM, ss(0.85, 1.08, dc) * 0.6);
    const vol = (1 - 0.35 * ss(0.6, 1.1, dc)) * (1.08 - 0.3 * ss(90, 340, wy)); // 가장자리로 갈수록 둥글게 어두워진다
    const g = (0.6 + 0.55 * light) * vol;
    const i = (y * TW + x) * 4;
    px[i] = Math.min(255, col[0] * g); px[i + 1] = Math.min(255, col[1] * g); px[i + 2] = Math.min(255, col[2] * g);
    px[i + 3] = Math.round(255 * (0.62 + 0.36 * h));
  }
}
const webp = await sharp(px, { raw: { width: TW, height: TH, channels: 4 } })
  .resize(W * 1.5, H * 1.5).blur(0.45).webp({ quality: 72, alphaQuality: 80 }).toBuffer();

// 빛나는 뉴런 점: 주름 능선 위에서 고른다
const origin = [168, 168]; // 전전두엽에서 물결이 시작된다
const sparks = [];
for (let tries = 0; sparks.length < 34 && tries < 40000; tries++) {
  const x = 130 + rnd() * 400, y = 60 + rnd() * 280;
  if (!inside(cerPoly, x, y) || hOf(x * S, y * S) < 0.8) continue;
  if (sparks.some(([a, b]) => Math.hypot(a - x, b - y) < 40)) continue;
  sparks.push([Math.round(x), Math.round(y)]);
}
const delay = ([x, y]) => (Math.hypot(x - origin[0], y - origin[1]) / 400 * 4.2).toFixed(2);
const cols = ['#ffe8a3', '#7ef0dd', '#f5c2ff', '#a5d8ff'];

const svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
<defs>
<radialGradient id="aura" cx="46%" cy="44%"><stop offset="0" stop-color="#9b7bff" stop-opacity=".34"/><stop offset=".5" stop-color="#2dd4bf" stop-opacity=".1"/><stop offset="1" stop-color="#2dd4bf" stop-opacity="0"/></radialGradient>
<radialGradient id="wave"><stop offset="0" stop-color="#fff4d6" stop-opacity=".0"/><stop offset=".62" stop-color="#fff4d6" stop-opacity=".0"/><stop offset=".8" stop-color="#ffe9b8" stop-opacity=".55"/><stop offset=".9" stop-color="#7ef0dd" stop-opacity=".25"/><stop offset="1" stop-color="#7ef0dd" stop-opacity="0"/></radialGradient>
<radialGradient id="spark"><stop offset="0" stop-color="#fff" stop-opacity="1"/><stop offset=".2" stop-color="#fff" stop-opacity=".55"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
<linearGradient id="rim" x1="0" x2="1"><stop offset="0" stop-color="#7ef0dd"/><stop offset=".55" stop-color="#c4a6ff"/><stop offset="1" stop-color="#f5c2ff"/></linearGradient>
<linearGradient id="stem" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#b9a3ff" stop-opacity=".7"/><stop offset="1" stop-color="#b9a3ff" stop-opacity="0"/></linearGradient>
<clipPath id="clip"><path d="${CER}"/><path d="${CEREB}"/></clipPath>
</defs>
<style>
.wave{transform-box:fill-box;transform-origin:center;animation:wave 9s cubic-bezier(.3,.1,.3,1) infinite}
.rim{animation:rim 9s ease-in-out infinite}
.sp{transform-box:fill-box;transform-origin:center;animation:sp 9s ease-in-out infinite}
@keyframes wave{0%{transform:scale(.05);opacity:0}6%{opacity:1}75%{transform:scale(1.15);opacity:.9}100%{transform:scale(1.3);opacity:0}}
@keyframes rim{0%,100%{stroke-opacity:.45}50%{stroke-opacity:.9}}
@keyframes sp{0%,100%{opacity:.25;transform:scale(.5)}8%{opacity:1;transform:scale(1.25)}35%{opacity:.6;transform:scale(.85)}}
@media (prefers-reduced-motion:reduce){.wave,.rim,.sp{animation:none}.wave{opacity:0}}
</style>
<ellipse cx="320" cy="215" rx="310" ry="225" fill="url(#aura)"/>
<path d="${STEM}" fill="url(#stem)"/><path d="${STEM}" fill="none" stroke="#c4a6ff" stroke-opacity=".35"/>
<image width="${W}" height="${H}" xlink:href="data:image/webp;base64,${webp.toString('base64')}"/>
<g clip-path="url(#clip)"><circle class="wave" cx="${origin[0]}" cy="${origin[1]}" r="420" fill="url(#wave)" style="mix-blend-mode:screen"/></g>
<g fill="none" stroke-linecap="round">
<path class="rim" d="${CER}" stroke="url(#rim)" stroke-width="2"/>
<path class="rim" d="${CEREB}" stroke="url(#rim)" stroke-width="1.6"/>
</g>
${sparks.map((p, i) => `<circle class="sp" cx="${p[0]}" cy="${p[1]}" r="9" fill="url(#spark)" style="animation-delay:${delay(p)}s"/><circle cx="${p[0]}" cy="${p[1]}" r="1.4" fill="${cols[i % cols.length]}"/>`).join('')}
</svg>`;
writeFileSync(new URL('../public/cosmos-brain.svg', import.meta.url), svg);
console.log('cosmos-brain.svg', (svg.length / 1024).toFixed(0) + 'KB', sparks.length, 'sparks');
