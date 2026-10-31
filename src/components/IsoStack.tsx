import { motion } from 'framer-motion';
import { LEVELS, type Level } from '../types';

// Exploded axonometric of one building: four floors floating above each other.
// Front faces are darker, so the depth reads at a glance.
const SHADE: Record<Level, [string, string, string]> = {
  pshat: ['#a65d2e', '#84491f', '#66371a'],
  remez: ['#4f6b3a', '#3e5630', '#2f4224'],
  derash: ['#1f3558', '#18294a', '#111f38'],
  sod: ['#5b3a6e', '#4a2f5a', '#37233f'],
};

interface Props {
  active: Level;
  onSelect: (level: Level) => void;
}

export default function IsoStack({ active, onSelect }: Props) {
  return (
    <div className="iso">
      <svg viewBox="0 0 300 320" className="iso-svg" role="group" aria-label="ארבע קומות הפרשנות">
        {LEVELS.map((lv, i) => {
          const cy = 240 - i * 62;
          const top = `150,${cy - 40} 250,${cy} 150,${cy + 40} 50,${cy}`;
          const left = `50,${cy} 150,${cy + 40} 150,${cy + 64} 50,${cy + 24}`;
          const right = `150,${cy + 40} 250,${cy} 250,${cy + 24} 150,${cy + 64}`;
          const [c0, c1, c2] = SHADE[lv.id];
          const select = () => onSelect(lv.id);
          return (
            <motion.g
              key={lv.id}
              initial={{ opacity: 0, y: -28 }}
              animate={active === lv.id ? { opacity: 1, y: [0, -4, 0] } : { opacity: 1, y: 0 }}
              transition={active === lv.id ? { y: { duration: 2.6, repeat: Infinity, ease: 'easeInOut' }, opacity: { duration: 0.3 } } : { delay: i * 0.12, duration: 0.4 }}
            >
            <g
              className={`floor${active === lv.id ? ' is-active' : ''}`}
              role="button"
              tabIndex={0}
              aria-pressed={active === lv.id}
              aria-label={`${lv.name}: ${lv.floor}`}
              onClick={select}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  select();
                }
              }}
            >
              <polygon points={left} fill={c1} />
              <polygon points={right} fill={c2} />
              <polygon points={top} fill={c0} />
            </g>
            </motion.g>
          );
        })}
      </svg>
      <ol className="floor-list">
        {[...LEVELS].reverse().map((lv) => (
          <li key={lv.id}>
            <button
              type="button"
              className={`floor-btn press${active === lv.id ? ' is-active' : ''}`}
              aria-pressed={active === lv.id}
              onClick={() => onSelect(lv.id)}
              style={{ ['--swatch' as string]: lv.color }}
            >
              <span className="floor-name">{lv.name}</span>
              <span className="floor-where">{lv.floor}</span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}
