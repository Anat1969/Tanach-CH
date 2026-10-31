import { useRef, useState } from 'react';
import { PEOPLE } from '../content/people';
import type { Tree, UnionKind } from '../content/families';

const BW = 132; // box width
const BH = 56; // box height

const STYLE: Record<UnionKind, { stroke: string; dash?: string; width: number }> = {
  marriage: { stroke: 'var(--ink)', width: 2.5 },
  concubine: { stroke: '#c0803f', dash: '6 5', width: 2.5 },
  bond: { stroke: '#6f9a6b', dash: '3 6', width: 2.5 },
  conflict: { stroke: '#b5655a', dash: '8 4', width: 2.5 },
};

interface Props {
  tree: Tree;
  selected?: string;
  onPick?: (id: string) => void;
  // People in the stories in focus; they are drawn stronger, the rest recede.
  highlight?: string[];
}

// Generations as rows. Couples share a line; children hang from a bus under their parents.
export default function FamilyTree({ tree, selected = '', onPick = () => undefined, highlight = [] }: Props) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const drag = useRef<{ x: number; y: number; px: number; py: number } | null>(null);
  const pos = new Map(tree.nodes.map((n) => [n.id, n]));
  const center = (id: string) => {
    const n = pos.get(id);
    return n ? { x: n.x, y: n.y + BH / 2 } : { x: 0, y: 0 };
  };
  const name = (id: string) => PEOPLE.find((p) => p.id === id);
  // Who the person is a child of, written in words under the name.
  const childOf = (id: string): string => {
    const parents = tree.parentage.filter((p) => p.child === id).flatMap((p) => p.parents);
    if (parents.length === 0) return '';
    const names = parents.map((pid) => PEOPLE.find((x) => x.id === pid)?.he ?? pid);
    return `בן ל${names.join(' ו')}`;
  };

  // Spouses on the same row with someone between them go under the row, so no line crosses a box.
  const unionPath = (a: string, b: string) => {
    const A = pos.get(a);
    const B = pos.get(b);
    if (!A || !B) return null;
    const ca = center(a);
    const cb = center(b);
    const sameRow = A.y === B.y;
    const between = tree.nodes.some(
      (n) => n.y === A.y && n.id !== a && n.id !== b && n.x > Math.min(A.x, B.x) && n.x < Math.max(A.x, B.x),
    );
    if (sameRow && between) {
      const y = A.y + BH + 22;
      return `M${ca.x} ${A.y + BH} V${y} H${cb.x} V${B.y + BH}`;
    }
    if (sameRow) return `M${ca.x} ${ca.y} H${cb.x}`;
    return `M${ca.x} ${ca.y} L${cb.x} ${cb.y}`;
  };

  const childPaths = tree.parentage.flatMap(({ parents, child }) => {
    const c = pos.get(child);
    if (!c) return [];
    const parentBottoms = parents.map((p) => pos.get(p)).filter((p): p is NonNullable<typeof p> => Boolean(p));
    if (parentBottoms.length === 0) return [];
    const topOfChild = c.y;
    const bottom = Math.max(...parentBottoms.map((p) => p.y + BH));
    const midY = (bottom + topOfChild) / 2;
    return parentBottoms.map((p) => `M${p.x} ${p.y + BH} V${midY} H${c.x} V${topOfChild}`);
  });

  const siblingBus = tree.siblings && tree.siblings.length > 1 ? tree.siblings.map((id) => pos.get(id)).filter(Boolean) : [];
  const busY = siblingBus.length ? Math.min(...siblingBus.map((n) => n!.y)) - 28 : 0;

  return (
    <div className="tree-wrap">
      <div className="tree-zoom" role="group" aria-label="זום העץ">
        <button type="button" className="chip press" onClick={() => setZoom((z) => Math.max(0.4, z / 1.25))} aria-label="התקרבות">−</button>
        <button type="button" className="chip press" onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }} aria-label="איפוס זום">{Math.round(zoom * 100)}%</button>
        <button type="button" className="chip press" onClick={() => setZoom((z) => Math.min(2.5, z * 1.25))} aria-label="הגדלה">+</button>
      </div>
      <div
        className="tree-view"
        onPointerDown={(e) => {
          drag.current = { x: e.clientX, y: e.clientY, px: pan.x, py: pan.y };
          (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
        }}
        onPointerMove={(e) => {
          const d = drag.current;
          if (d) setPan({ x: d.px + (e.clientX - d.x), y: d.py + (e.clientY - d.y) });
        }}
        onPointerUp={() => (drag.current = null)}
        onPointerCancel={() => (drag.current = null)}
        onWheel={(e) => setZoom((z) => Math.min(2.5, Math.max(0.4, z * (e.deltaY < 0 ? 1.1 : 0.9))))}
      >
      <div className="tree-stage" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}>
    <svg viewBox={`0 0 ${tree.w} ${tree.h}`} className="family-tree" role="img" aria-label={tree.he} style={{ direction: 'ltr' }}>
      {/* Links first, so boxes sit on top. */}
      {tree.unions.map((u) => {
        const d = unionPath(u.a, u.b);
        if (!d) return null;
        const s = STYLE[u.kind];
        return (
          <path
            key={`${u.a}-${u.b}`}
            d={d}
            fill="none"
            stroke={s.stroke}
            strokeWidth={s.width}
            strokeDasharray={s.dash}
            strokeLinecap="round"
            className={`link link-${u.kind}`}
          />
        );
      })}
      {childPaths.map((d, i) => (
        <path key={i} d={d} fill="none" stroke="var(--ink)" strokeWidth={2} strokeLinecap="round" className="link link-child" />
      ))}
      {siblingBus.length > 0 && (
        <g>
          <path
            d={`M${Math.min(...siblingBus.map((n) => n!.x))} ${busY} H${Math.max(...siblingBus.map((n) => n!.x))}`}
            stroke="var(--ink)"
            strokeWidth={2}
            fill="none"
          />
          {siblingBus.map((n) => (
            <path key={n!.x} d={`M${n!.x} ${busY} V${n!.y}`} stroke="var(--ink)" strokeWidth={2} fill="none" />
          ))}
          <text x={(Math.min(...siblingBus.map((n) => n!.x)) + Math.max(...siblingBus.map((n) => n!.x))) / 2} y={busY - 8} textAnchor="middle" className="tree-note-label" style={{ direction: 'rtl' }}>
            אחים
          </text>
        </g>
      )}

      {tree.nodes.map((n) => {
        const p = name(n.id);
        if (!p) return null;
        const on = selected === n.id;
        const focus = highlight.length === 0 || highlight.includes(n.id);
        return (
          <g
            key={n.id}
            className={`tree-node${on ? ' is-selected' : ''}${focus ? '' : ' is-dim'}`}
            role="button"
            tabIndex={0}
            aria-pressed={on}
            aria-label={`${p.he}, ${p.en}`}
            onClick={() => onPick(n.id)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onPick(n.id);
              }
            }}
          >
            <rect x={n.x - BW / 2} y={n.y} width={BW} height={BH} className="tree-box" />
            <text x={n.x} y={n.y + 26} textAnchor="middle" className="tree-he" style={{ direction: 'rtl' }}>
              {p.he}
            </text>
            <text x={n.x} y={n.y + 44} textAnchor="middle" className="tree-en" style={{ direction: 'rtl' }}>
              {childOf(n.id)}
            </text>
            <text x={n.x} y={n.y + 44} textAnchor="middle" className="tree-en">
            </text>
          </g>
        );
      })}
    </svg>
      </div>
      </div>
    </div>
  );
}
