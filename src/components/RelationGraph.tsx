import { motion } from 'framer-motion';
import { KIND_LABEL, PEOPLE, type Relation, type RelationKind } from '../content/people';

const KIND_COLOR: Record<RelationKind, string> = {
  family: '#a65d2e',
  conflict: '#b3261e',
  bond: '#4f6b3a',
};

interface Props {
  centerId: string;
  related: (Relation & { other: string })[];
  onPick: (id: string) => void;
}

// A constellation: the chosen person at the center, each relation drawn as a line to a neighbor.
export default function RelationGraph({ centerId, related, onPick }: Props) {
  const cx = 200;
  const cy = 200;
  const R = 150;
  const name = (id: string) => PEOPLE.find((p) => p.id === id)?.he ?? id;
  const center = PEOPLE.find((p) => p.id === centerId)?.he ?? '';

  return (
    <svg viewBox="0 0 400 400" className="rel-graph" role="img" aria-label={`קשרי ${center}`}>
      {related.map((r, i) => {
        const angle = (-Math.PI / 2) + (i * 2 * Math.PI) / Math.max(related.length, 1);
        const x = cx + R * Math.cos(angle);
        const y = cy + R * Math.sin(angle);
        return (
          <g key={`${r.other}-${r.label}`}>
            <motion.line
              x1={cx}
              y1={cy}
              x2={x}
              y2={y}
              stroke={KIND_COLOR[r.kind]}
              strokeWidth={3}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.6, delay: 0.1 + i * 0.08 }}
            />
            <motion.g
              role="button"
              tabIndex={0}
              className="rel-node"
              onClick={() => onPick(r.other)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onPick(r.other);
                }
              }}
              initial={{ opacity: 0, scale: 0.4 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + i * 0.08, duration: 0.3 }}
            >
              <circle cx={x} cy={y} r={36} className="rel-node-circle" />
              <text x={x} y={y + 5} textAnchor="middle" className="rel-node-text" style={{ direction: 'rtl' }}>
                {name(r.other)}
              </text>
            </motion.g>
          </g>
        );
      })}
      <circle cx={cx} cy={cy} r={38} className="rel-center" />
      <text x={cx} y={cy + 6} textAnchor="middle" className="rel-center-text" style={{ direction: 'rtl' }}>
        {center}
      </text>
      <text x={cx} y={390} textAnchor="middle" className="rel-legend" style={{ direction: 'rtl' }}>
        {Object.values(KIND_LABEL).join(' · ')}
      </text>
    </svg>
  );
}
