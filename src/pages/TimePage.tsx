import { motion } from 'framer-motion';
import Rich from '../components/Rich';
import { TIMELINE, ERA_COLOR } from '../content/timeline';
import TimeTrack from '../components/TimeTrack';

export default function TimePage() {
  return (
    <div className="time-page">
      <header className="page-head">
        <p className="eyebrow">סדר מקראי · לא בקנה מידה</p>
        <h1>המאורעות מסתדרים בסדר אחד.</h1>
        <p className="lead">
          <Rich text="**עשרה** אירועים מרכזיים, לפי הסדר שבו הם מופיעים במקרא. תאריך מופיע רק כשיש **הסכמה** בחקר." />
        </p>
      </header>

      <TimeTrack />

      <ul className="legend-eras" aria-label="תקופות">
        {Object.entries(ERA_COLOR).map(([era, color]) => (
          <li key={era} className="legend-item">
            <span className="dot-line" style={{ background: color }} /> {era}
          </li>
        ))}
      </ul>

      <ol className="timeline">
        {TIMELINE.map((ev, i) => (
          <motion.li
            key={ev.id}
            id={ev.id}
            className="tl-item"
            style={{ borderInlineStartColor: ERA_COLOR[ev.era] }}
            initial={{ x: 12 }}
            animate={{ x: 0 }}
            transition={{ duration: 0.35, delay: i * 0.03 }}
          >
            <p className="eyebrow">
              <span className="era" style={{ background: ERA_COLOR[ev.era] }}>
                {ev.era}
              </span>
              {ev.date && <span className="date">{ev.date}</span>}
            </p>
            <h2>{ev.title}</h2>
            <p>{ev.note}</p>
            <p className="source">מקור: {ev.ref}</p>
            {ev.storyId && (
              <a className="chip press" href={`#/stories/${ev.storyId}`}>
                לסיפור
              </a>
            )}
          </motion.li>
        ))}
      </ol>
    </div>
  );
}
