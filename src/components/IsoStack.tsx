import { LEVELS, type Level } from '../types';
import Spiral from './Spiral';

interface Props {
  active: Level;
  onSelect: (level: Level) => void;
}

// The four readings: the spiral on the left, the defined terms on the right.
export default function IsoStack({ active, onSelect }: Props) {
  return (
    <div className="iso">
      <Spiral active={active} onSelect={onSelect} size={260} />
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
