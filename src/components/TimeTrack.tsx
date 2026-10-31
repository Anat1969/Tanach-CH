import { motion } from 'framer-motion';
import { TIMELINE, ERA_COLOR, type Era } from '../content/timeline';

// A ruler in biblical order. Era bands sit above it; each event is a tick, labels alternate above and below.
// The spacing is by order, not by years: no date is implied where the text gives none.
const W = 1000;
const LEFT = 40;
const RIGHT = 960;

interface Props {
  highlightEras?: Era[];
  highlightIds?: string[];
}

export default function TimeTrack({ highlightEras, highlightIds }: Props) {
  const focusEras = highlightEras ?? [];
  const focusIds = highlightIds ?? [];
  const dimmed = (on: boolean) => (on || (focusEras.length === 0 && focusIds.length === 0) ? 1 : 0.28);
  const n = TIMELINE.length;
  const step = (RIGHT - LEFT) / (n - 1);
  const xs = TIMELINE.map((_, i) => LEFT + i * step);

  // Bands are drawn per contiguous run of one era, so a return to an era gets its own label.
  const runs: { era: Era; first: number; last: number }[] = [];
  TIMELINE.forEach((ev, i) => {
    const prev = runs[runs.length - 1];
    if (prev && prev.era === ev.era && prev.last === i - 1) prev.last = i;
    else runs.push({ era: ev.era, first: i, last: i });
  });
  const bands = runs.map((r) => {
    const x0 = r.first === 0 ? 0 : (xs[r.first - 1] + xs[r.first]) / 2;
    const x1 = r.last === n - 1 ? W : (xs[r.last] + xs[r.last + 1]) / 2;
    return { era: r.era, x0, x1, key: `${r.era}-${r.first}` };
  });

  return (
    <div className="time-track">
      <svg viewBox={`0 0 ${W} 210`} className="time-svg" role="group" aria-label="ציר זמן מקראי">
        {bands.map((b, i) => (
          <g key={b.key}>
            <rect x={b.x0} y={0} width={b.x1 - b.x0} height={46} fill={ERA_COLOR[b.era]} opacity={dimmed(focusEras.includes(b.era))} />
            <text x={(b.x0 + b.x1) / 2} y={28} textAnchor="middle" className="band-label" style={{ direction: 'rtl' }}>
              {b.era}
            </text>
            {i > 0 && <line x1={b.x0} y1={0} x2={b.x0} y2={46} className="band-divider" />}
          </g>
        ))}

        <motion.line
          x1={LEFT}
          y1={120}
          x2={RIGHT}
          y2={120}
          className="track-line"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.4, ease: 'easeInOut' }}
        />

        {TIMELINE.map((ev, i) => {
          const above = i % 2 === 0;
          const label = ev.title.length > 22 ? `${ev.title.slice(0, 21)}…` : ev.title;
          // Labels stay centered and are clamped inside the viewBox, so no edge label is cut.
          const labelX = Math.min(Math.max(xs[i], 110), W - 110);
          return (
            <motion.g
              key={ev.id}
              className="track-dot"
              role="button"
              tabIndex={0}
              aria-label={ev.title}
              onClick={() => document.getElementById(ev.id)?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  document.getElementById(ev.id)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: focusIds.includes(ev.id) ? 1.35 : 1, opacity: dimmed(focusIds.length === 0 || focusIds.includes(ev.id)) }}
              transition={{ delay: 0.4 + i * 0.1, duration: 0.3 }}
            >
              <line x1={xs[i]} y1={46} x2={xs[i]} y2={120} className="track-stem" />
              <circle cx={xs[i]} cy={120} r={22} fill="transparent" />
              <circle cx={xs[i]} cy={120} r={9} fill={ERA_COLOR[ev.era]} stroke="var(--ink)" strokeWidth={2} />
              <line x1={xs[i]} y1={120} x2={xs[i]} y2={above ? 150 : 90} className="track-stem" />
              <text
                x={labelX}
                y={above ? 168 : 80}
                textAnchor="middle"
                className="track-label"
                style={{ direction: 'rtl' }}
              >
                {label}
              </text>
            </motion.g>
          );
        })}
      </svg>
      <p className="source-line">לחצו על נקודה כדי לגלול אל האירוע. המרווחים הם סדר, לא זמן. הרצועות צבועות לפי תקופה.</p>
    </div>
  );
}
