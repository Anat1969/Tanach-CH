import { useEffect, useRef, useState } from 'react';
import { animate, motion, MotionConfig } from 'framer-motion';
import { ROUTES, CLOSE_VIEW, type RouteDef } from '../content/route';
import MapBase from './MapBase';
import { usePanZoom } from '../lib/panzoom';
import { GEO_VIEW } from '../content/geo-data';

export const MAP_VIEW = GEO_VIEW;
const JOURNEY_SECONDS = 12;

interface Props {
  route: RouteDef;
  selectedId: string | null;
  onSelect: (id: string) => void;
  // Increments each time the reader presses "הפעל מסע". Zero means no journey yet.
  playToken: number;
  // Stops linked to the stories in focus. They get a ring, the rest recede.
  highlightStopIds?: string[];
  // 'wide' shows the whole region, 'close' the land of Israel.
  zoom?: 'wide' | 'close';
}

export default function RouteMap({ route, selectedId, onSelect, playToken, highlightStopIds = [], zoom = 'wide' }: Props) {
  const view = zoom === 'close' ? CLOSE_VIEW : MAP_VIEW;
  const pz = usePanZoom(view);
  // The close-up is zoomed in, so labels and markers scale down to keep their proportion.
  const k = zoom === 'close' ? 0.5 : 1;
  const byId = new Map(route.stops.map((s) => [s.id, s]));
  const ordered = route.path.map((id) => byId.get(id)).filter((s): s is NonNullable<typeof s> => Boolean(s));
  const d = `M${ordered.map((s) => `${s.x},${s.y}`).join(' L')}`;

  const guideRef = useRef<SVGPathElement>(null);
  const [t, setT] = useState(0);
  const [len, setLen] = useState(0);

  useEffect(() => {
    setT(0);
    setLen(guideRef.current?.getTotalLength() ?? 0);
  }, [route.id]);

  useEffect(() => {
    if (playToken === 0) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      setT(1);
      return;
    }
    setT(0);
    const controls = animate(0, 1, { duration: JOURNEY_SECONDS, ease: 'linear', onUpdate: (v) => setT(v) });
    return () => controls.stop();
  }, [playToken]);

  const traveler = len > 0 && guideRef.current ? guideRef.current.getPointAtLength(t * len) : ordered[0];
  const segments = Math.max(ordered.length - 1, 1);
  const reached = (i: number) => t >= i / segments - 0.001;

  return (
    <MotionConfig reducedMotion="user">
      <svg
        ref={pz.ref}
        viewBox={pz.viewBox}
        className="map-svg"
        role="img"
        aria-labelledby="map-title"
        style={{ direction: 'ltr', touchAction: 'none', cursor: 'grab' }}
        onPointerDown={pz.onPointerDown}
        onPointerMove={pz.onPointerMove}
        onPointerUp={pz.onPointerUp}
        onPointerCancel={pz.onPointerUp}
        onDoubleClick={pz.reset}
      >
        <title id="map-title">{`מפה סכמטית: ${route.he}`}</title>
        <MapBase />

        {/* Both routes are drawn; the chosen one is full strength. */}
        {ROUTES.map((r) => {
          const pts = r.path
            .map((id) => r.stops.find((s) => s.id === id))
            .filter((s): s is NonNullable<typeof s> => Boolean(s));
          const active = r.id === route.id;
          return (
            <g key={r.id} className={`route-layer${active ? ' is-active' : ''}`}>
              <polyline
                points={pts.map((s) => `${s.x},${s.y}`).join(' ')}
                fill="none"
                stroke={r.color}
                strokeWidth={active ? 6 : 3}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray={active ? undefined : '2 8'}
                opacity={active ? 1 : 0.45}
              />
              {!active &&
                r.stops.map((s) => <circle key={s.id} cx={s.x} cy={s.y} r={4} fill={r.color} opacity={0.6} />)}
            </g>
          );
        })}

        <path ref={guideRef} d={d} className="route-guide" />

        {route.stops.map((s) => {
          const selected = selectedId === s.id;
          const order = ordered.findIndex((o) => o.id === s.id);
          const isReached = playToken > 0 && order >= 0 && reached(order);
          const labelX = s.side === 'l' ? s.x - 16 : s.x + 16;
          return (
            <motion.g
              key={s.id}
              className={`station${selected ? ' is-selected' : ''}${isReached ? ' is-reached' : ''}`}
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
              {highlightStopIds.includes(s.id) && <circle cx={s.x} cy={s.y} r={20 * k} className="station-focus" />}
              <circle cx={s.x} cy={s.y} r={22 * k} className="station-hit" />
              <circle
                cx={s.x}
                cy={s.y}
                r={(selected ? 12 : 8) * k}
                fill={s.onPath ? route.color : 'var(--paper)'}
                stroke="var(--ink)"
                strokeWidth={2}
              />
              <text x={labelX} y={s.y + 4} textAnchor={s.side === 'l' ? 'end' : 'start'} className="st-he" style={{ direction: 'ltr', fontSize: 16 * k * 0.8, strokeWidth: 4 * k }}>
                {`${route.stops.indexOf(s) + 1}. ${s.he}`}
              </text>
              <text x={labelX} y={s.y + 19 * k + 4} textAnchor={s.side === 'l' ? 'end' : 'start'} className="st-en" style={{ direction: 'ltr', fontSize: 11 * k }}>
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
