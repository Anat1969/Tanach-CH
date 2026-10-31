import { motion } from 'framer-motion';
import Rich from '../components/Rich';
import { TIMELINE, ERA_COLOR } from '../content/timeline';
import TimeTrack from '../components/TimeTrack';
import Correlation from '../components/Correlation';
import { STORIES } from '../content/stories';
import { useState } from 'react';

const ERAS = Object.keys(ERA_COLOR) as (keyof typeof ERA_COLOR)[];

export default function TimePage() {
  const [era, setEra] = useState<keyof typeof ERA_COLOR | null>(null);
  const eraStories = STORIES.filter((s) => (era ? s.era === era : true));
  return (
    <div className="time-page">
      <header className="page-head">
        <p className="eyebrow">סדר מקראי · לא בקנה מידה</p>
        <h1>המאורעות מסתדרים בסדר אחד.</h1>
        <p className="lead">
          <Rich text="**עשרה** אירועים מרכזיים על ציר של **שנים**. כל אירוע מסומן כ**מוסכם** בחקר, או כ**הערכה**." />
        </p>
      </header>

      <div className="route-switch" role="group" aria-label="בחירת תקופה">
        <button type="button" className={`chip press${era === null ? ' is-active' : ''}`} aria-pressed={era === null} onClick={() => setEra(null)}>
          כל התקופות
        </button>
        {ERAS.map((e) => (
          <button key={e} type="button" className={`chip press${era === e ? ' is-active' : ''}`} aria-pressed={era === e} onClick={() => setEra(e)}>
            {e}
          </button>
        ))}
      </div>

      <TimeTrack highlightEras={era ? [era] : undefined} />

      <div className="block">
        <Correlation key={era ?? 'all'} title={era ? `תקופת ${era}` : 'כל הסיפורים'} initial="place" stories={eraStories} eras={era ? [era] : undefined} />
      </div>

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
              <span className="date">{ev.when}</span>
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
