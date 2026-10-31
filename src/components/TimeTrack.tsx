import { motion } from 'framer-motion';
import { usePanZoom } from '../lib/panzoom';
import { TIMELINE, ERA_COLOR, ERA_SPAN, type Era } from '../content/timeline';

// A true year scale: 2000 לפנה"ס to 100 לספירה. Position is the year, not the order.
// Dates are approximate where the event's `when` says so.
const W = 1000;
const X0 = 40;
const X1 = 960;
const Y_MIN = -2000;
const Y_MAX = 100;
const xOf = (year: number) => X0 + ((year - Y_MIN) / (Y_MAX - Y_MIN)) * (X1 - X0);

// Bands along the year scale. The second destruction (70 לספירה) is its own segment of the same era.
const SEGMENTS: { era: Era; from: number; to: number; key: string }[] = [
  { era: 'אבות', from: ERA_SPAN.אבות[0], to: ERA_SPAN.אבות[1], key: 'אבות' },
  { era: 'יציאה', from: ERA_SPAN.יציאה[0], to: ERA_SPAN.יציאה[1], key: 'יציאה' },
  { era: 'מלוכה', from: ERA_SPAN.מלוכה[0], to: ERA_SPAN.מלוכה[1], key: 'מלוכה' },
  { era: 'חורבן', from: ERA_SPAN.חורבן[0], to: ERA_SPAN.חורבן[1], key: 'חורבן-1' },
  { era: 'שיבה', from: ERA_SPAN.שיבה[0], to: -300, key: 'שיבה' },
  { era: 'חורבן', from: -300, to: 100, key: 'חורבן-2' },
];

// Dark text on light bands, light text on dark ones (relative luminance).
const textOn = (hex: string): string => {
  const n = parseInt(hex.slice(1), 16);
  const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return lum > 0.6 ? '#1c1a17' : '#fdfdfc';
};

const TICKS = [-2000, -1750, -1500, -1250, -1000, -750, -500, -250, 0, 100];
const tickLabel = (y: number) => (y < 0 ? `−${Math.abs(y)}` : y === 0 ? '0' : `${y}`);

interface Props {
  highlightEras?: Era[];
  highlightIds?: string[];
}

export default function TimeTrack({ highlightEras, highlightIds }: Props) {
  const focusEras = highlightEras ?? [];
  const focusIds = highlightIds ?? [];
  const idle = focusEras.length === 0 && focusIds.length === 0;
  const pz = usePanZoom(`0 0 ${W} 230`);
  const dimmed = (on: boolean) => (on || idle ? 1 : 0.28);

  return (
    <div className="time-track">
      <svg
        ref={pz.ref}
        viewBox={pz.viewBox}
        className="time-svg"
        role="group"
        aria-label="ציר זמן מקראי לפי שנים"
        style={{ touchAction: 'none', cursor: 'grab' }}
        onPointerDown={pz.onPointerDown}
        onPointerMove={pz.onPointerMove}
        onPointerUp={pz.onPointerUp}
        onPointerCancel={pz.onPointerUp}
        onDoubleClick={pz.reset}
      >
        {SEGMENTS.map((seg) => {
          const x0 = xOf(seg.from);
          const x1 = xOf(seg.to);
          return (
            <g key={seg.key}>
              <rect x={x0} y={0} width={x1 - x0} height={46} fill={ERA_COLOR[seg.era]} opacity={dimmed(focusEras.includes(seg.era))} />
              {x1 - x0 > 60 && (
                <text x={(x0 + x1) / 2} y={28} textAnchor="middle" className="band-label" style={{ direction: 'rtl', fill: textOn(ERA_COLOR[seg.era]) }}>
                  {seg.era}
                </text>
              )}
            </g>
          );
        })}

        <motion.line
          x1={X0}
          y1={120}
          x2={X1}
          y2={120}
          className="track-line"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.4, ease: 'easeInOut' }}
        />

        {TICKS.map((y) => (
          <g key={y}>
            <line x1={xOf(y)} y1={114} x2={xOf(y)} y2={126} className="year-tick" />
            <text x={xOf(y)} y={216} textAnchor="middle" className="year-label">
              {tickLabel(y)}
            </text>
          </g>
        ))}

        {TIMELINE.map((ev, i) => {
          const above = i % 2 === 0;
          const x = xOf(ev.year);
          const label = ev.title.length > 20 ? `${ev.title.slice(0, 19)}…` : ev.title;
          // Two label rows per side, so neighbouring events in the same century do not overlap.
          const row = Math.floor(i / 2) % 2;
          const labelY = above ? (row ? 62 : 80) : (row ? 190 : 168);
          const stemEnd = above ? (row ? 62 : 80) + 4 : (row ? 190 : 168) - 14;
          const on = focusIds.includes(ev.id);
          return (
            <motion.g
              key={ev.id}
              className="track-dot"
              role="button"
              tabIndex={0}
              aria-label={`${ev.title}, ${ev.when}`}
              onClick={() => document.getElementById(ev.id)?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  document.getElementById(ev.id)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: on ? 1.35 : 1, opacity: dimmed(idle || on) }}
              transition={{ delay: 0.4 + i * 0.1, duration: 0.3 }}
            >
              <line x1={x} y1={46} x2={x} y2={120} className="track-stem" />
              <circle cx={x} cy={120} r={22} fill="transparent" />
              <circle cx={x} cy={120} r={9} fill={ERA_COLOR[ev.era]} stroke="var(--ink)" strokeWidth={2} />
              <line x1={x} y1={120} x2={x} y2={stemEnd} className="track-stem" />
              <text x={Math.min(Math.max(x, 110), W - 110)} y={labelY} textAnchor="middle" className="track-label" style={{ direction: 'rtl' }}>
                {label}
              </text>
            </motion.g>
          );
        })}
      </svg>
      <p className="source-line">
        המספרים הם שנים לפני הספירה משמאל עד 0, ואחריהם שנים לספירה. כל אירוע מסומן כ"הערכה" או "מוסכם בחקר" בכרטיס שלו.
      </p>
    </div>
  );
}
