import { motion } from 'framer-motion';
import { LEVELS, type Level } from '../types';

// Four readings drawn as four arcs, one per ring, from the inner (פשט) to the outer (סוד).
// The arc's length is how far that reading goes toward closing the circle; the colour is its meaning.
const RADIUS = [38, 66, 94, 122];
const SWEEP = [90, 180, 270, 359.5];

function arcPath(r: number, sweep: number): string {
  const cx = 150;
  const cy = 150;
  const rad = (deg: number) => (deg * Math.PI) / 180;
  const sx = cx;
  const sy = cy - r;
  const ex = cx + r * Math.sin(rad(sweep));
  const ey = cy - r * Math.cos(rad(sweep));
  const large = sweep > 180 ? 1 : 0;
  return `M ${sx} ${sy} A ${r} ${r} 0 ${large} 1 ${ex.toFixed(2)} ${ey.toFixed(2)}`;
}

interface Props {
  active?: Level;
  onSelect?: (level: Level) => void;
  size?: number;
  // Each arc draws in turn, from פשט to סוד, so the reading reads as a sequence.
  animate?: boolean;
}

export default function Spiral({ active, onSelect, size = 300, animate = true }: Props) {
  return (
    <svg viewBox="0 0 300 300" width={size} height={size} className="spiral" role="group" aria-label="4 מושגי הפרשנות, מהפשט לסוד">
      {RADIUS.map((r) => (
        <circle key={`track-${r}`} cx={150} cy={150} r={r} className="spiral-track" />
      ))}
      {LEVELS.map((lv: { id: Level; color: string; name: string; floor: string }, i: number) => {
        const isActive = active === lv.id;
        const d = arcPath(RADIUS[i], SWEEP[i]);
        return (
          <g
            key={lv.id}
            className={`spiral-arc${isActive ? ' is-active' : ''}`}
            role={onSelect ? 'button' : undefined}
            tabIndex={onSelect ? 0 : undefined}
            aria-label={`${lv.name}: ${lv.floor}`}
            onClick={onSelect ? () => onSelect(lv.id) : undefined}
            onKeyDown={
              onSelect
                ? (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onSelect(lv.id);
                    }
                  }
                : undefined
            }
          >
            <motion.path
              d={d}
              fill="none"
              stroke={lv.color}
              strokeWidth={isActive ? 13 : 8}
              strokeLinecap="round"
              initial={animate ? { pathLength: 0 } : { pathLength: 1 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.1, delay: animate ? i * 0.35 : 0, ease: 'easeOut' }}
              opacity={active && !isActive ? 0.45 : 1}
            />
          </g>
        );
      })}
    </svg>
  );
}
