import { motion } from 'framer-motion';
import { TIMELINE, ERA_COLOR } from '../content/timeline';

// A horizontal track in biblical order. Each dot draws in, then scrolls to its entry on click.
export default function TimeTrack() {
  const width = 1000;
  const xs = TIMELINE.map((_, i) => 60 + (i * (width - 120)) / (TIMELINE.length - 1));
  return (
    <div className="time-track">
      <svg viewBox={`0 0 ${width} 130`} className="time-svg" role="group" aria-label="ציר זמן מקראי">
        <motion.line
          x1={xs[0]}
          y1={60}
          x2={xs[xs.length - 1]}
          y2={60}
          className="track-line"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.6, ease: 'easeInOut' }}
        />
        {TIMELINE.map((ev, i) => (
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
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 + i * 0.12, duration: 0.3 }}
          >
            <circle cx={xs[i]} cy={60} r={22} fill="transparent" />
            <circle cx={xs[i]} cy={60} r={10} fill={ERA_COLOR[ev.era]} stroke="var(--ink)" strokeWidth={2} />
            <text x={xs[i]} y={100} textAnchor="middle" className="track-label" style={{ direction: 'rtl' }}>
              {ev.title.length > 14 ? `${ev.title.slice(0, 13)}…` : ev.title}
            </text>
          </motion.g>
        ))}
      </svg>
      <p className="source-line">לחצו על נקודה כדי לגלול אל האירוע. המרווחים הם סדר, לא זמן.</p>
    </div>
  );
}
