// 빛나는 데이터 포인트 뇌를 만든다.
//  - public/cosmos-brain.svg : 프레임 배경용(투명). 점 구름 질감(WebP) 위에 전전두엽·해마 반짝임과 빛의 물결을 얹는다
//  - exports/brain-wallpaper.png : 맑은 사파이어 배경 가운데에 뇌를 둔 2560×1440 배경 이미지
// 대뇌 주름은 반응-확산(Gray-Scott) 미로 무늬로 기르고, 점은 그 이랑을 따라 뿌린다.
// 실행: node scripts/gen-brain.mjs
import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const W = 640, H = 460;
const CELL = 1.4; // 시뮬레이션 한 칸 = 1.4px, 주름 폭이 이 값을 따른다
const GW = Math.round(W / CELL), GH = Math.round(H / CELL);

// 옆에서 본 뇌, 왼쪽이 앞(전두엽)
const CER = 'M118 246C96 170 152 88 238 68C310 46 392 50 452 86C522 126 552 198 528 258C512 302 470 324 430 320C412 346 370 356 338 340C304 360 252 354 226 330C176 336 132 302 118 246Z';
const CEREB = 'M412 318C442 330 486 322 500 296C516 330 488 370 444 370C418 368 402 350 412 318Z';
const STEM = 'M378 336C386 366 384 398 374 430C384 436 396 436 404 430C406 398 410 366 412 336Z';
const SYLVIAN = 'M196 282C236 262 272 250 310 238C350 226 380 214 404 192';
const HIPPO = 'M302 292C318 276 344 270 366 276C382 280 392 292 388 304C384 314 370 314 364 304'; // 측두엽 안쪽 해마
const PFC = { cx: 178, cy: 168, rx: 62, ry: 74 }; // 전전두엽
// 기저핵(선조체): 꼬리핵의 C자 곡선과 그 아래 조가비핵. 습관이 자리 잡으면 일이 전전두엽에서 이곳으로 넘어간다
const CAUDATE = 'M246 196C250 170 280 158 310 162C336 166 352 184 350 206C348 224 336 236 322 240';
const PUTAMEN = { cx: 292, cy: 214, rx: 30, ry: 19 };

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
const distTo = (poly, x, y) => {
  let m = 1e9;
  for (let i = 1; i < poly.length; i++) {
    const [ax, ay] = poly[i - 1], [bx, by] = poly[i], dx = bx - ax, dy = by - ay;
    const t = Math.max(0, Math.min(1, ((x - ax) * dx + (y - ay) * dy) / (dx * dx + dy * dy)));
    m = Math.min(m, Math.hypot(x - ax - t * dx, y - ay - t * dy));
  }
  return m;
};
const ss = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
const cerPoly = polygon(CER), cerebPoly = polygon(CEREB), sylPoly = polygon(SYLVIAN), hippoPts = polygon(HIPPO);

let seed = 11;
const rnd = () => ((seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0) / 4294967296);

// ── Gray-Scott 미로 무늬 (결과는 임시 폴더에 두고 다시 쓴다) ──
const n = GW * GH;
const CACHE = join(tmpdir(), `jes-lu-brain-field-${GW}x${GH}.bin`);
let v;
if (existsSync(CACHE)) {
  v = new Float32Array(readFileSync(CACHE).buffer.slice(0));
} else {
  let u = new Float32Array(n).fill(1);
  v = new Float32Array(n);
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
  // 영역별 방향성: 위쪽은 세로, 측두엽은 가로로 주름이 눕는다
  const AX = new Float32Array(n), AY = new Float32Array(n);
  for (let y = 0; y < GH; y++) for (let x = 0; x < GW; x++) {
    const wx = x * CELL, wy = y * CELL;
    const below = wy > 300 - (wx - 190) * 0.42;
    const t = below ? 1 : wx < 200 ? 0.5 : 0;
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
  writeFileSync(CACHE, Buffer.from(v.buffer));
}
// 화면 좌표(px) → 이랑 높이(1 = 이랑 꼭대기, 0 = 고랑)
const ridge = (x, y) => {
  const gx = Math.min(GW - 1.001, Math.max(0, x / CELL)), gy = Math.min(GH - 1.001, Math.max(0, y / CELL));
  const x0 = Math.floor(gx), y0 = Math.floor(gy), fx = gx - x0, fy = gy - y0;
  const a = v[y0 * GW + x0], b = v[y0 * GW + x0 + 1], c = v[(y0 + 1) * GW + x0], d = v[(y0 + 1) * GW + x0 + 1];
  return ss(0.4, 0.22, (a * (1 - fx) + b * fx) * (1 - fy) + (c * (1 - fx) + d * fx) * fy);
};

// ── 색: 앞쪽은 맑은 파랑, 아래와 뒤에서 노랑·빨강·초록이 부드럽게 번진다 ──
const BLUE = [138, 180, 248], CYAN = [160, 225, 255], YELLOW = [253, 214, 99], RED = [242, 139, 130], GREEN = [129, 201, 149], WHITE = [240, 246, 255];
const mix = (a, b, t) => a.map((x, i) => Math.round(x + (b[i] - x) * t));
const hex = (c) => '#' + c.map((x) => x.toString(16).padStart(2, '0')).join('');
function tint(x, y) {
  const warmth = Math.min(1, ss(170, 340, y) * 0.75 + ss(360, 520, x) * 0.45);
  const warm = x > 430 ? GREEN : y > 280 ? (x < 300 ? YELLOW : RED) : x > 360 ? GREEN : YELLOW;
  return mix(mix(BLUE, CYAN, rnd() * 0.6), warm, warmth * (0.45 + rnd() * 0.4));
}

// ── 점 구름: 이랑을 따라 촘촘하고, 고랑과 외측고랑은 비워 둔다 ──
const dots = [];
for (let tries = 0; dots.length < 5200 && tries < 400000; tries++) {
  const x = 100 + rnd() * 440, y = 50 + rnd() * 330;
  const inCer = inside(cerPoly, x, y), inCereb = !inCer && inside(cerebPoly, x, y);
  if (!inCer && !inCereb) continue;
  let p;
  if (inCer) p = ridge(x, y) * ss(1, 6, distTo(sylPoly, x, y)) * 0.9 + 0.04;
  else p = 0.5 + 0.5 * Math.sin((y + ((x - 455) ** 2) / 120) * 0.95);
  if (rnd() > p) continue;
  dots.push([x, y, 0.35 + rnd() ** 3 * 1.1, tint(x, y), 0.35 + rnd() * 0.6]);
}
// 가장자리를 따라 조금 더 밝은 점: 뇌의 윤곽이 빛으로 드러난다
for (const poly of [cerPoly, cerebPoly]) for (let i = 0; i < poly.length; i++) {
  const [ax, ay] = poly[i], [bx, by] = poly[(i + 1) % poly.length];
  for (let k = 0; k < 5; k++) {
    const t = rnd(), j = (rnd() - 0.5) * 5;
    dots.push([ax + (bx - ax) * t + j, ay + (by - ay) * t + j, 0.5 + rnd() * 0.6, mix(tint(ax, ay), WHITE, 0.4), 0.55 + rnd() * 0.4]);
  }
}

// ── 빛의 섬유: 전두엽에서 뒤쪽으로 우아하게 휘어 가는 신경로 ──
const fibers = [];
for (let i = 0; i < 26; i++) {
  const sx = 150 + rnd() * 70, sy = 120 + rnd() * 120;
  const ex = 400 + rnd() * 110, ey = 100 + rnd() * 170;
  const lift = -60 - rnd() * 70 + (sy > 200 ? 90 : 0);
  fibers.push([`M${sx.toFixed(0)} ${sy.toFixed(0)}C${(sx + 80).toFixed(0)} ${(sy + lift).toFixed(0)} ${(ex - 90).toFixed(0)} ${(ey + lift * 0.7).toFixed(0)} ${ex.toFixed(0)} ${ey.toFixed(0)}`, hex(tint(ex, ey))]);
}
// 해마 쪽으로 내려가는 섬유
for (let i = 0; i < 8; i++) {
  const [hx, hy] = hippoPts[Math.floor(rnd() * hippoPts.length)];
  fibers.push([`M${(170 + rnd() * 40).toFixed(0)} ${(180 + rnd() * 40).toFixed(0)}C${(220 + rnd() * 30).toFixed(0)} ${(250 + rnd() * 30).toFixed(0)} ${(270 + rnd() * 20).toFixed(0)} ${(300 + rnd() * 10).toFixed(0)} ${hx.toFixed(0)} ${hy.toFixed(0)}`, hex(mix(CYAN, YELLOW, 0.3))]);
}

// 정적인 뇌 그림 (점 구름·섬유·속빛). sharp가 이 SVG를 그림으로 굽는다
function staticBrain(scale) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W * scale}" height="${H * scale}" viewBox="0 0 ${W} ${H}">
<defs>
<filter id="soft" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="6"/></filter>
<filter id="glow" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="1.6"/></filter>
<radialGradient id="inner" cx="42%" cy="42%" r="60%"><stop offset="0" stop-color="#bcd4ff" stop-opacity=".34"/><stop offset=".6" stop-color="#5b8cff" stop-opacity=".1"/><stop offset="1" stop-color="#5b8cff" stop-opacity="0"/></radialGradient>
<radialGradient id="under" cx="50%" cy="100%" r="70%"><stop offset="0" stop-color="#fdd663" stop-opacity=".32"/><stop offset=".45" stop-color="#f28b82" stop-opacity=".16"/><stop offset="1" stop-color="#81c995" stop-opacity="0"/></radialGradient>
<clipPath id="clip"><path d="${CER}"/><path d="${CEREB}"/></clipPath>
</defs>
<g clip-path="url(#clip)">
<rect width="${W}" height="${H}" fill="url(#inner)"/>
<rect y="160" width="${W}" height="${H - 160}" fill="url(#under)"/>
</g>
<path d="${STEM}" fill="#8ab4f8" fill-opacity=".14"/>
<g fill="none" stroke-linecap="round" clip-path="url(#clip)">
<g filter="url(#soft)" stroke-width="5" stroke-opacity=".16">${fibers.map(([d, c]) => `<path d="${d}" stroke="${c}"/>`).join('')}</g>
<g stroke-width=".9" stroke-opacity=".5">${fibers.map(([d, c]) => `<path d="${d}" stroke="${c}"/>`).join('')}</g>
</g>
<g filter="url(#glow)" opacity=".7">${dots.filter((_, i) => i % 3 === 0).map(([x, y, r, c]) => `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(r * 2.2).toFixed(2)}" fill="${hex(c)}"/>`).join('')}</g>
<g>${dots.map(([x, y, r, c, o]) => `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(2)}" fill="${hex(c)}" fill-opacity="${o.toFixed(2)}"/>`).join('')}</g>
<path d="${CER}" fill="none" stroke="#cfe0ff" stroke-opacity=".22" stroke-width="6" filter="url(#soft)"/>
</svg>`;
}

// 반짝이는 두 영역에 둘 네 갈래 별
const twinkles = [];
const inEllipse = (e, x, y) => ((x - e.cx) / e.rx) ** 2 + ((y - e.cy) / e.ry) ** 2 < 1;
for (let tries = 0; twinkles.length < 18 && tries < 20000; tries++) {
  const x = PFC.cx + (rnd() * 2 - 1) * PFC.rx, y = PFC.cy + (rnd() * 2 - 1) * PFC.ry;
  if (!inEllipse(PFC, x, y) || !inside(cerPoly, x, y) || twinkles.some(([a, b]) => Math.hypot(a - x, b - y) < 20)) continue;
  twinkles.push([Math.round(x), Math.round(y), 'p']);
}
for (let i = 0; i < hippoPts.length; i += 2) {
  const [x, y] = hippoPts[i];
  twinkles.push([Math.round(x + (rnd() - 0.5) * 8), Math.round(y + (rnd() - 0.5) * 8), 'h']);
}
const star = (x, y, r) => {
  const k = r * 0.1;
  return `M${x} ${y - r}C${x + k} ${y - k} ${x + k} ${y - k} ${x + r} ${y}C${x + k} ${y + k} ${x + k} ${y + k} ${x} ${y + r}C${x - k} ${y + k} ${x - k} ${y + k} ${x - r} ${y}C${x - k} ${y - k} ${x - k} ${y - k} ${x} ${y - r}Z`;
};
// 뇌 곳곳에서 따로 반짝이는 데이터 포인트
const nodes = [];
for (let tries = 0; nodes.length < 40 && tries < 40000; tries++) {
  const x = 130 + rnd() * 400, y = 60 + rnd() * 280;
  if (!inside(cerPoly, x, y) || ridge(x, y) < 0.8 || nodes.some(([a, b]) => Math.hypot(a - x, b - y) < 34)) continue;
  nodes.push([Math.round(x), Math.round(y)]);
}
const origin = [PFC.cx, PFC.cy]; // 빛의 물결은 전전두엽에서 시작한다
const delay = ([x, y]) => (Math.hypot(x - origin[0], y - origin[1]) / 400 * 4.2).toFixed(2);

const texture = await sharp(Buffer.from(staticBrain(1.6))).webp({ quality: 78, alphaQuality: 85 }).toBuffer();
const svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
<defs>
<radialGradient id="aura" cx="46%" cy="50%"><stop offset="0" stop-color="#5b8cff" stop-opacity=".22"/><stop offset=".55" stop-color="#81c995" stop-opacity=".06"/><stop offset="1" stop-color="#81c995" stop-opacity="0"/></radialGradient>
<radialGradient id="wave"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".64" stop-color="#fff" stop-opacity="0"/><stop offset=".82" stop-color="#e8f0ff" stop-opacity=".4"/><stop offset=".92" stop-color="#fdd663" stop-opacity=".16"/><stop offset="1" stop-color="#fdd663" stop-opacity="0"/></radialGradient>
<radialGradient id="pfc"><stop offset="0" stop-color="#fff6dc" stop-opacity=".9"/><stop offset=".35" stop-color="#fdd663" stop-opacity=".4"/><stop offset=".7" stop-color="#8ab4f8" stop-opacity=".14"/><stop offset="1" stop-color="#8ab4f8" stop-opacity="0"/></radialGradient>
<radialGradient id="hip"><stop offset="0" stop-color="#f1fff6" stop-opacity=".95"/><stop offset=".4" stop-color="#81c995" stop-opacity=".45"/><stop offset="1" stop-color="#8ab4f8" stop-opacity="0"/></radialGradient>
<radialGradient id="node"><stop offset="0" stop-color="#fff" stop-opacity="1"/><stop offset=".22" stop-color="#e8f0ff" stop-opacity=".5"/><stop offset="1" stop-color="#8ab4f8" stop-opacity="0"/></radialGradient>
<radialGradient id="bg"><stop offset="0" stop-color="#fff1f1" stop-opacity=".95"/><stop offset=".3" stop-color="#ff6b78" stop-opacity=".6"/><stop offset=".7" stop-color="#ff3d55" stop-opacity=".18"/><stop offset="1" stop-color="#ff3d55" stop-opacity="0"/></radialGradient>
<linearGradient id="habit" x1="0" x2="1"><stop offset="0" stop-color="#fff6dc"/><stop offset=".35" stop-color="#ff8a8f"/><stop offset="1" stop-color="#ff4d5e"/></linearGradient>
<linearGradient id="hipline" x1="0" x2="1"><stop offset="0" stop-color="#81c995"/><stop offset=".5" stop-color="#fdd663"/><stop offset="1" stop-color="#f28b82"/></linearGradient>
<clipPath id="clip"><path d="${CER}"/><path d="${CEREB}"/></clipPath>
</defs>
<style>
.wave{transform-box:fill-box;transform-origin:center;animation:wave 9s cubic-bezier(.3,.1,.3,1) infinite}
.zone{transform-box:fill-box;transform-origin:center;animation:zone 9s ease-in-out infinite}
.tw{transform-box:fill-box;transform-origin:center;animation:tw 2.6s ease-in-out infinite}
.nd{transform-box:fill-box;transform-origin:center;animation:nd 9s ease-in-out infinite}
.link{fill:none;stroke:#fff6dc;stroke-width:2.2;stroke-linecap:round;stroke-dasharray:60 940;animation:link 9s ease-in-out infinite}
.hipline{animation:hipglow 9s ease-in-out infinite}
@keyframes wave{0%{transform:scale(.05);opacity:0}6%{opacity:1}75%{transform:scale(1.15);opacity:.9}100%{transform:scale(1.3);opacity:0}}
@keyframes zone{0%,100%{opacity:.6;transform:scale(.92)}10%,30%{opacity:1;transform:scale(1.08)}}
@keyframes tw{0%,100%{opacity:.2;transform:scale(.35) rotate(0deg)}50%{opacity:1;transform:scale(1) rotate(45deg)}}
@keyframes nd{0%,100%{opacity:.3;transform:scale(.55)}8%{opacity:1;transform:scale(1.2)}35%{opacity:.6;transform:scale(.85)}}
@keyframes link{0%,8%{stroke-dashoffset:1000;opacity:0}12%{opacity:1}40%{stroke-dashoffset:0;opacity:1}48%,100%{stroke-dashoffset:0;opacity:0}}
@keyframes hipglow{0%,30%,100%{stroke-opacity:.5}42%{stroke-opacity:1}}
.habit{fill:none;stroke:url(#habit);stroke-width:4.5;stroke-linecap:round;stroke-dasharray:70 930;animation:habit 9s cubic-bezier(.45,0,.25,1) infinite;filter:drop-shadow(0 0 6px #ff5c6c) drop-shadow(0 0 2px #fff)}
.bgz{transform-box:fill-box;transform-origin:center;animation:bgz 9s ease-in-out infinite}
.caud{animation:caud 9s ease-in-out infinite}
@keyframes habit{0%,28%{stroke-dashoffset:1000;opacity:0}32%{opacity:1}56%{stroke-dashoffset:0;opacity:1}62%,100%{stroke-dashoffset:0;opacity:0}}
@keyframes bgz{0%,45%,100%{opacity:.4;transform:scale(.88)}58%,78%{opacity:1;transform:scale(1.12)}}
@keyframes caud{0%,45%,100%{stroke-opacity:.35}60%,78%{stroke-opacity:1}}
@media (prefers-reduced-motion:reduce){.wave,.zone,.tw,.nd,.link,.hipline,.habit,.bgz,.caud{animation:none}.wave,.link,.habit{opacity:0}}
</style>
<ellipse cx="320" cy="220" rx="310" ry="225" fill="url(#aura)"/>
<image width="${W}" height="${H}" xlink:href="data:image/webp;base64,${texture.toString('base64')}"/>
<g clip-path="url(#clip)"><circle class="wave" cx="${origin[0]}" cy="${origin[1]}" r="420" fill="url(#wave)"/></g>
<ellipse class="zone" cx="${PFC.cx}" cy="${PFC.cy}" rx="${PFC.rx * 1.25}" ry="${PFC.ry * 1.15}" fill="url(#pfc)"/>
<ellipse class="zone" cx="346" cy="292" rx="70" ry="34" fill="url(#hip)" style="animation-delay:3.4s"/>
<path class="hipline" d="${HIPPO}" fill="none" stroke="url(#hipline)" stroke-width="4.5" stroke-linecap="round"/>
<ellipse class="bgz" cx="${PUTAMEN.cx}" cy="${PUTAMEN.cy}" rx="${PUTAMEN.rx * 1.9}" ry="${PUTAMEN.ry * 2.2}" fill="url(#bg)"/>
<path class="caud" d="${CAUDATE}" fill="none" stroke="#ff5c6c" stroke-width="12" stroke-linecap="round" stroke-opacity=".35" style="filter:blur(5px)"/>
<path class="caud" d="${CAUDATE}" fill="none" stroke="#ffb3b9" stroke-width="2" stroke-linecap="round" stroke-dasharray="1 7"/>
<ellipse class="bgz" cx="${PUTAMEN.cx}" cy="${PUTAMEN.cy}" rx="${PUTAMEN.rx}" ry="${PUTAMEN.ry}" fill="url(#bg)" style="animation-delay:.4s"/>
${polygon(CAUDATE).filter((_, i) => i % 5 === 2).concat([[PUTAMEN.cx - 14, PUTAMEN.cy + 4], [PUTAMEN.cx + 12, PUTAMEN.cy - 6], [PUTAMEN.cx + 2, PUTAMEN.cy + 10]]).map(([x, y], i) => `<path class="tw" d="${star(Math.round(x), Math.round(y), 6 + (i % 3) * 2)}" fill="${i % 2 ? '#ffe3e6' : '#ff8a94'}" style="animation-delay:-${(i * 0.53 % 2.6).toFixed(2)}s;animation-duration:${(1.8 + (i % 3) * 0.5).toFixed(2)}s"/>`).join('')}
<path class="habit" pathLength="1000" d="M${PFC.cx + 10} ${PFC.cy - 6}C210 150 240 175 262 196S${PUTAMEN.cx - 4} ${PUTAMEN.cy - 2} ${PUTAMEN.cx} ${PUTAMEN.cy}"/>
<path class="link" pathLength="1000" d="M${PFC.cx + 20} ${PFC.cy + 30}C240 250 280 300 ${hippoPts[0][0]} ${hippoPts[0][1]}"/>
${nodes.map((p) => `<circle class="nd" cx="${p[0]}" cy="${p[1]}" r="8" fill="url(#node)" style="animation-delay:${delay(p)}s"/>`).join('')}
${twinkles.map(([x, y, z], i) => `<path class="tw" d="${star(x, y, z === 'p' ? 8 + (i % 3) * 3 : 7 + (i % 2) * 2.5)}" fill="${z === 'p' ? (i % 3 ? '#fff6dc' : '#ffffff') : (i % 2 ? '#f1fff6' : '#fff0ee')}" style="animation-delay:-${(i * 0.37 % 2.6).toFixed(2)}s;animation-duration:${(2 + (i % 4) * 0.45).toFixed(2)}s"/>`).join('')}
</svg>`;
writeFileSync(new URL('../public/cosmos-brain.svg', import.meta.url), svg);

// ── 배경 이미지: 깊은 사파이어에서 옅은 블루-화이트로, 넓은 여백과 빛의 강, 부드러운 보케 ──
const BW = 2560, BH = 1440;
const ribbons = [...Array(7)].map((_, i) => {
  const y0 = 820 + i * 70 + rnd() * 40;
  const c = [BLUE, CYAN, YELLOW, GREEN, RED, BLUE, CYAN][i];
  return `<path d="M-200 ${y0}C500 ${y0 - 260 - rnd() * 120} 1100 ${y0 + 200} 1700 ${y0 - 120}S2500 ${y0 - 300} 2800 ${y0 - 160}" fill="none" stroke="${hex(c)}" stroke-width="${10 + rnd() * 26}" stroke-opacity="${(0.12 + rnd() * 0.12).toFixed(2)}" stroke-linecap="round"/>`;
}).join('');
const bokeh = [...Array(22)].map(() => {
  const x = rnd() * BW, y = rnd() * BH, r = 30 + rnd() * 120;
  if (Math.hypot((x - BW / 2) / 1.6, y - BH / 2) < 380) return '';
  const c = [BLUE, YELLOW, GREEN, RED, CYAN][Math.floor(rnd() * 5)];
  return `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${r.toFixed(0)}" fill="${hex(c)}" fill-opacity="${(0.08 + rnd() * 0.14).toFixed(2)}"/>`;
}).join('');
const sky = `<svg xmlns="http://www.w3.org/2000/svg" width="${BW}" height="${BH}">
<defs>
<radialGradient id="sky" cx="78%" cy="-10%" r="130%"><stop offset="0" stop-color="#eef4ff"/><stop offset=".22" stop-color="#9dbdf2"/><stop offset=".5" stop-color="#2f63c4"/><stop offset=".78" stop-color="#0f3384"/><stop offset="1" stop-color="#071a4a"/></radialGradient>
<radialGradient id="halo" cx="50%" cy="52%" r="40%"><stop offset="0" stop-color="#9cc0ff" stop-opacity=".45"/><stop offset=".5" stop-color="#3a6fd1" stop-opacity=".18"/><stop offset="1" stop-color="#3a6fd1" stop-opacity="0"/></radialGradient>
<radialGradient id="warm" cx="50%" cy="78%" r="30%"><stop offset="0" stop-color="#fdd663" stop-opacity=".42"/><stop offset=".5" stop-color="#f28b82" stop-opacity=".12"/><stop offset="1" stop-color="#81c995" stop-opacity="0"/></radialGradient>
<filter id="b1"><feGaussianBlur stdDeviation="22"/></filter>
<filter id="b2"><feGaussianBlur stdDeviation="16"/></filter>
</defs>
<rect width="${BW}" height="${BH}" fill="url(#sky)"/>
<rect width="${BW}" height="${BH}" fill="url(#halo)"/>
<rect width="${BW}" height="${BH}" fill="url(#warm)"/>
<g filter="url(#b1)">${ribbons}</g>
<g filter="url(#b2)">${bokeh}</g>
</svg>`;
const BS = 2.7;
const brainPng = await sharp(Buffer.from(staticBrain(BS))).png().toBuffer();
const brainGlow = await sharp(brainPng).blur(28).modulate({ brightness: 1.6 }).png().toBuffer();
const bw = Math.round(W * BS), bh = Math.round(H * BS);
mkdirSync(new URL('../exports/', import.meta.url), { recursive: true });
await sharp(Buffer.from(sky))
  .composite([
    { input: brainGlow, left: Math.round((BW - bw) / 2), top: Math.round((BH - bh) / 2) + 40, blend: 'screen' },
    { input: brainPng, left: Math.round((BW - bw) / 2), top: Math.round((BH - bh) / 2) + 40, blend: 'over' },
  ])
  .png()
  .toFile(fileURLToPath(new URL('../exports/brain-wallpaper.png', import.meta.url)));

console.log('cosmos-brain.svg', (svg.length / 1024).toFixed(0) + 'KB', dots.length, 'dots', 'exports/brain-wallpaper.png');
