import { useEffect, useRef, useState } from 'react';
import { animate, motion, MotionConfig } from 'framer-motion';
import type { RouteDef } from '../content/route';

const SEA = 'M0 0 L95 0 C70 120 110 220 88 330 C66 440 120 520 96 600 C78 670 60 720 40 760 L0 760 Z';
const JORDAN = 'M420 0 C400 120 380 220 345 330 C320 430 300 520 285 600';
const JOURNEY_SECONDS = 12;

interface Props {
  route: RouteDef;
  selectedId: string | null;
  onSelect: (id: string) => void;
  // Increments each time the reader presses "הפעל מסע". Zero means no journey yet.
  playToken: number;
}

export default function RouteMap({ route, selectedId, onSelect, playToken }: Props) {
  const byId = new Map(route.stops.map((s) => [s.id, s]));
  const ordered = route.path.map((id) => byId.get(id)).filter((s): s is NonNullable<typeof s> => Boolean(s));
  const d = `M${ordered.map((s) => `${s.x},${s.y}`).join(' L')}`;

  const guideRef = useRef<SVGPathElement>(null);
  const [t, setT] = useState(0);
  const [len, setLen] = useState(0);

  // A new route starts from the first station.
  useEffect(() => {
    setT(0);
    setLen(guideRef.current?.getTotalLength() ?? 0);
  }, [route.id]);

  // Each press runs the journey once. Reduced motion jumps to the end.
  useEffect(() => {
    if (playToken === 0) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      setT(1);
      return;
    }
    setT(0);
    const controls = animate(0, 1, {
      duration: JOURNEY_SECONDS,
      ease: 'linear',
      onUpdate: (v) => setT(v),
    });
    return () => controls.stop();
  }, [playToken]);

  const traveler = len > 0 && guideRef.current ? guideRef.current.getPointAtLength(t * len) : ordered[0];
  const segments = Math.max(ordered.length - 1, 1);
  const reachedIndex = (i: number) => t >= i / segments - 0.001;

  return (
    <MotionConfig reducedMotion="user">
      <svg viewBox={route.view} className="map-svg" role="img" aria-labelledby="map-title" style={{ direction: 'ltr' }}>
        <title id="map-title">{`מפה סכמטית: ${route.he}`}</title>
        <rect x="-100" y="-100" width="900" height="1000" className="map-ground" />
        <path d={SEA} className="map-sea" />
        <path d={JORDAN} className="map-river" />
        <ellipse cx="285" cy="605" rx="12" ry="26" className="map-dead-sea" />
        <text x="405" y="150" className="map-label" style={{ direction: 'rtl' }}>
          הירדן
        </text>
        <text x="300" y="652" className="map-label map-label-small" style={{ direction: 'rtl' }}>
          ים המלח
        </text>
        <text x="520" y="40" className="map-label map-label-small" style={{ direction: 'rtl' }}>
          ארץ כנען (סכמטי)
        </text>

        <path ref={guideRef} d={d} className="route-guide" />

        <motion.path
          d={d}
          fill="none"
          stroke={route.color}
          strokeWidth={6}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.6, ease: 'easeInOut' }}
        />

        {route.stops.map((s) => {
          const selected = selectedId === s.id;
          const labelX = s.side === 'l' ? s.x - 16 : s.x + 16;
          const order = ordered.findIndex((o) => o.id === s.id);
          const reached = playToken > 0 && order >= 0 && reachedIndex(order);
          return (
            <motion.g
              key={s.id}
              className={`station${selected ? ' is-selected' : ''}${reached ? ' is-reached' : ''}`}
              role="button"
              tabIndex={0}
              aria-pressed={selected}
              aria-label={`${s.he}, ${s.en}`}
              onClick={() => onSelect(s.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelect(s.id);
                }
              }}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + Math.max(order, 0) * 0.12, duration: 0.3 }}
            >
              <circle cx={s.x} cy={s.y} r={22} className="station-hit" />
              <circle
                cx={s.x}
                cy={s.y}
                r={selected ? 12 : 8}
                fill={s.onPath ? route.color : 'var(--paper)'}
                stroke="var(--ink)"
                strokeWidth={2}
              />
              <text x={labelX} y={s.y + 4} textAnchor={s.side === 'l' ? 'end' : 'start'} className="st-he" style={{ direction: 'ltr' }}>
                {s.he}
              </text>
              <text x={labelX} y={s.y + 19} textAnchor={s.side === 'l' ? 'end' : 'start'} className="st-en" style={{ direction: 'ltr' }}>
                {s.en}
              </text>
            </motion.g>
          );
        })}

        {playToken > 0 && (
          <g aria-hidden="true">
            <circle cx={traveler.x} cy={traveler.y} r={14} className="traveler-halo" />
            <circle cx={traveler.x} cy={traveler.y} r={7} className="traveler" />
          </g>
        )}
      </svg>
    </MotionConfig>
  );
}
