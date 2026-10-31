import { motion, MotionConfig } from 'framer-motion';
import type { RouteDef } from '../content/route';

const SEA = 'M0 0 L95 0 C70 120 110 220 88 330 C66 440 120 520 96 600 C78 670 60 720 40 760 L0 760 Z';
const JORDAN = 'M420 0 C400 120 380 220 345 330 C320 430 300 520 285 600';

interface Props {
  route: RouteDef;
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export default function RouteMap({ route, selectedId, onSelect }: Props) {
  const byId = new Map(route.stops.map((s) => [s.id, s]));
  const points = route.path
    .map((id) => byId.get(id))
    .filter((s): s is NonNullable<typeof s> => Boolean(s))
    .map((s) => `${s.x},${s.y}`)
    .join(' ');

  return (
    <MotionConfig reducedMotion="user">
      <svg
        viewBox={route.view}
        className="map-svg"
        role="img"
        aria-labelledby="map-title"
        style={{ direction: 'ltr' }}
      >
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

        <motion.path
          d={points ? `M${points.split(' ').join(' L')}` : ''}
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
          return (
            <g
              key={s.id}
              className={`station${selected ? ' is-selected' : ''}`}
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
              <text
                x={labelX}
                y={s.y + 4}
                textAnchor={s.side === 'l' ? 'end' : 'start'}
                className="st-he"
                style={{ direction: 'ltr' }}
              >
                {s.he}
              </text>
              <text
                x={labelX}
                y={s.y + 19}
                textAnchor={s.side === 'l' ? 'end' : 'start'}
                className="st-en"
                style={{ direction: 'ltr' }}
              >
                {s.en}
              </text>
            </g>
          );
        })}
      </svg>
    </MotionConfig>
  );
}
