import { useEffect, useRef, useState } from 'react';

// Pan and zoom for an SVG with a fixed base viewBox: the mouse wheel zooms at the pointer, dragging moves.
// The hook returns the current viewBox and a ref to attach to the <svg>.
export function usePanZoom(base: string) {
  const [b] = useState(() => base.split(' ').map(Number));
  const [box, setBox] = useState({ x: b[0], y: b[1], w: b[2], h: b[3] });
  const ref = useRef<SVGSVGElement | null>(null);
  const drag = useRef<{ x: number; y: number; bx: number; by: number } | null>(null);

  // A new base view (for example, a different zoom level) starts from that view.
  useEffect(() => {
    const [x, y, w, h] = base.split(' ').map(Number);
    setBox({ x, y, w, h });
  }, [base]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const rect = el.getBoundingClientRect();
      const fx = (e.clientX - rect.left) / rect.width;
      const fy = (e.clientY - rect.top) / rect.height;
      const factor = e.deltaY < 0 ? 0.85 : 1 / 0.85;
      setBox((cur) => {
        const nw = Math.min(b[2] * 1.2, Math.max(b[2] / 12, cur.w * factor));
        const nh = nw * (cur.h / cur.w);
        return { x: cur.x + (cur.w - nw) * fx, y: cur.y + (cur.h - nh) * fy, w: nw, h: nh };
      });
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [b]);

  const onPointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    drag.current = { x: e.clientX, y: e.clientY, bx: box.x, by: box.y };
    (e.currentTarget as SVGSVGElement).setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const d = drag.current;
    const el = ref.current;
    if (!d || !el) return;
    const rect = el.getBoundingClientRect();
    const sx = box.w / rect.width;
    const sy = box.h / rect.height;
    setBox((cur) => ({ ...cur, x: d.bx - (e.clientX - d.x) * sx, y: d.by - (e.clientY - d.y) * sy }));
  };
  const onPointerUp = () => {
    drag.current = null;
  };

  const viewBox = `${box.x.toFixed(1)} ${box.y.toFixed(1)} ${box.w.toFixed(1)} ${box.h.toFixed(1)}`;
  const reset = () => setBox({ x: b[0], y: b[1], w: b[2], h: b[3] });
  return { viewBox, ref, onPointerDown, onPointerMove, onPointerUp, reset };
}
