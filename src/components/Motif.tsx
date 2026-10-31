import { motion } from 'framer-motion';
import { LEVELS } from '../types';

// The four floors drawn as four rings that open in sequence: pshat is the innermost, sod the outermost.
export default function Motif({ size = 120 }: { size?: number }) {
  return (
    <svg viewBox="0 0 200 200" width={size} height={size} className="motif" role="img" aria-label="ארבע קומות פרשנות">
      {LEVELS.map((lv, i) => (
        <motion.circle
          key={lv.id}
          cx={100}
          cy={100}
          r={18 + i * 22}
          fill="none"
          stroke={lv.color}
          strokeWidth={6}
          strokeLinecap="round"
          strokeDasharray="0 1000"
          initial={{ strokeDasharray: '0 1000', rotate: -90 }}
          animate={{ strokeDasharray: '260 1000', rotate: 0 }}
          style={{ originX: '100px', originY: '100px' }}
          transition={{ duration: 1.4, delay: i * 0.25, ease: 'easeOut' }}
        />
      ))}
      <motion.circle
        cx={100}
        cy={100}
        r={6}
        className="motif-core"
        animate={{ scale: [1, 1.35, 1] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
        style={{ originX: '100px', originY: '100px' }}
      />
    </svg>
  );
}
