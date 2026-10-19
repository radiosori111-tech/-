// Brain Integrity Atlas: 습관 · 의지를 가운데 허브로 두고 뇌과학 개념 아홉 개를 둘러 놓은 지식 지도.
// 서버에서 전체 모습을 그려 두고(SSR) 화면에 보일 때만 스크립트를 붙인다(client:visible).
// 붙은 스크립트는 노드에 마우스나 포커스가 갔을 때 그 노드와 이어진 선만 밝히는 일만 한다.
import { useState } from 'preact/hooks';
import './atlas.css';

export interface AtlasNode { id: string; name: string; count: number; href: string; tags: string[] }
interface Props {
  hub: AtlasNode;
  nodes: AtlasNode[];
  links: [string, string][];
  label: string;
  countFormat: string; // '{n}편'처럼, {n} 자리에 글 수가 들어간다
  current?: string;
}

// 허브 둘레의 타원 위 자리 (백분율). 이어진 개념끼리 가까이 오도록 순서를 정해 둔다
const ORDER = ['exercise', 'emotion', 'neurotransmitter', 'synapse', 'memory', 'sleep', 'immunity', 'nutrition', 'bdnf'];
const place = (i: number, n: number) => {
  const a = -Math.PI / 2 + (i / n) * Math.PI * 2;
  return { x: 50 + Math.cos(a) * 38, y: 50 + Math.sin(a) * 36 };
};

export default function BrainAtlasGraph({ hub, nodes, links, label, countFormat, current }: Props) {
  const countLabel = (n: number) => countFormat.replace('{n}', String(n));
  const [focus, setFocus] = useState<string | null>(null);
  const sorted = [...nodes].sort((a, b) => ORDER.indexOf(a.id) - ORDER.indexOf(b.id));
  const pos: Record<string, { x: number; y: number }> = { [hub.id]: { x: 50, y: 50 } };
  sorted.forEach((n, i) => (pos[n.id] = place(i, sorted.length)));
  const spokes = sorted.map((n) => [hub.id, n.id] as [string, string]);
  const all = [...spokes, ...links.filter(([a, b]) => a !== hub.id && b !== hub.id)];
  const lit = (a: string, b: string) => focus !== null && (a === focus || b === focus);
  const node = (n: AtlasNode, isHub = false) => (
    <a
      href={n.href}
      class={`atlas-node${isHub ? ' is-hub' : ''}${current === n.id ? ' is-current' : ''}${focus && focus !== n.id && !all.some(([a, b]) => lit(a, b) && (a === n.id || b === n.id)) ? ' is-dim' : ''}`}
      style={{ left: `${pos[n.id].x}%`, top: `${pos[n.id].y}%` }}
      aria-current={current === n.id ? 'page' : undefined}
      onMouseEnter={() => setFocus(n.id)}
      onMouseLeave={() => setFocus(null)}
      onFocus={() => setFocus(n.id)}
      onBlur={() => setFocus(null)}
    >
      {isHub && <span class="atlas-pulse" aria-hidden="true" />}
      <span class="atlas-name">{n.name}</span>
      <span class="atlas-count">{countLabel(n.count)}</span>
      <span class="atlas-tags">{n.tags.map((t) => <span class="atlas-tag">{t}</span>)}</span>
    </a>
  );
  return (
    <figure class="atlas" role="group" aria-label={label}>
      <figcaption class="atlas-caption">{label}</figcaption>
      <svg class="atlas-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id="atlas-line" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0" stop-color="#22d3ee" />
            <stop offset="0.5" stop-color="#34d399" />
            <stop offset="1" stop-color="#a78bfa" />
          </linearGradient>
        </defs>
        {all.map(([a, b]) => (
          <line
            x1={pos[a].x} y1={pos[a].y} x2={pos[b].x} y2={pos[b].y}
            class={`atlas-line${a === hub.id ? ' is-spoke' : ''}${lit(a, b) ? ' is-lit' : ''}`}
            vector-effect="non-scaling-stroke"
          />
        ))}
      </svg>
      {node(hub, true)}
      {sorted.map((n) => node(n))}
    </figure>
  );
}
