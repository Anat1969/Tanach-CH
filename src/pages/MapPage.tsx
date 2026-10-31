import { useState } from 'react';
import { motion } from 'framer-motion';
import RouteMap from '../components/RouteMap';
import Rich from '../components/Rich';
import { ROUTES } from '../content/route';
import { setRoute } from '../lib/hash';
import Correlation from '../components/Correlation';
import { STORIES } from '../content/stories';

interface Props {
  routeId: string | null;
}

export default function MapPage({ routeId }: Props) {
  const route = ROUTES.find((r) => r.id === routeId) ?? ROUTES[0];
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [playToken, setPlayToken] = useState(0);
  const [zoom, setZoom] = useState<'wide' | 'close'>('wide');
  const stop = route.stops.find((s) => s.id === selectedId) ?? null;

  const choose = (id: string) => {
    setRoute(['map'], { route: id });
    setSelectedId(null);
  };

  return (
    <div className="map-page">
      <header className="page-head">
        <p className="eyebrow">מסלול · תחנות · סיפורים</p>
        <h1>המקרא נעשה בתנועה.</h1>
        <p className="lead">
          <Rich text="**מסע** בין תחנות על מפה סכמטית. לחצו על **תחנה** כדי לראות את הפסוק ואת הסיפור שקשור אליה." />
        </p>
      </header>

      <div className="route-switch" role="group" aria-label="בחירת מסע">
        {ROUTES.map((r) => (
          <button
            key={r.id}
            type="button"
            className={`chip press${route.id === r.id ? ' is-active' : ''}`}
            aria-pressed={route.id === r.id}
            onClick={() => choose(r.id)}
          >
            {r.he}
          </button>
        ))}
      </div>
      <p className="route-sub">{route.subtitle}</p>

      <div className="map-layout">
        <div className="map-frame">
          <div className="route-switch zoom-switch" role="group" aria-label="תצוגה">
            <button type="button" className={`chip press${zoom === 'wide' ? ' is-active' : ''}`} aria-pressed={zoom === 'wide'} onClick={() => setZoom('wide')}>המזרח הקרוב</button>
            <button type="button" className={`chip press${zoom === 'close' ? ' is-active' : ''}`} aria-pressed={zoom === 'close'} onClick={() => setZoom('close')}>ארץ ישראל מקרוב</button>
          </div>
          <RouteMap route={route} selectedId={selectedId} onSelect={setSelectedId} playToken={playToken} zoom={zoom} />
          <div className="journey-bar">
            <button type="button" className="chip press" onClick={() => setPlayToken((n) => n + 1)}>
              {playToken === 0 ? 'הפעל מסע' : 'הפעל שוב'}
            </button>
            <span className="muted">המסע לוקח כ-12 שניות. התחנות נדלקות כשהנקודה מגיעה אליהן.</span>
          </div>
          <div className="legend" aria-label="מקרא">
            <span className="legend-item">
              <span className="dot dot-filled" style={{ background: route.color }} /> תחנה על המסלול
            </span>
            <span className="legend-item">
              <span className="dot dot-hollow" /> תחנה נוספת
            </span>
            <span className="legend-item">
              <span className="dot-line" style={{ background: route.color }} /> מסלול
            </span>
          </div>
        </div>

        <motion.aside key={stop?.id ?? 'none'} className="panel map-detail" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
          {stop ? (
            <>
              <p className="eyebrow">{stop.ref}</p>
              <h2>
                {stop.he} <span className="en">({stop.en})</span>
              </h2>
              <p>
                <Rich text={stop.note} />
              </p>
              <p className="dig-note">
                <strong>תיעוד ארכיאולוגי:</strong> {stop.dig}
              </p>
              {stop.disputed && <p className="dispute-note">מיקום שנוי במחלוקת. המיקום המוצג הוא הצעה לאתר זיהוי.</p>}
              {stop.storyIds.length > 0 ? (
                <div className="story-links">
                  {stop.storyIds.map((sid) => {
                    const st = STORIES.find((s) => s.id === sid);
                    return st ? (
                      <a key={sid} className="chip press" href={`#/stories/${st.id}`}>
                        {st.title}
                      </a>
                    ) : null;
                  })}
                </div>
              ) : (
                <p className="muted">לתחנה הזו אין סיפור מקושר עדיין.</p>
              )}
            </>
          ) : (
            <>
              <p className="eyebrow">בחרו תחנה</p>
              <p>
                <Rich text={`המסע כולל **${route.stops.length}** תחנות. לחצו על אחת מהן כדי לקרוא את הפסוק הרלוונטי.`} />
              </p>
              <ol className="plain-list stop-list">
                {route.stops.map((s) => (
                  <li key={s.id}>
                    <button type="button" className="link-btn" onClick={() => setSelectedId(s.id)}>
                      {s.he}
                    </button>
                    <span className="eyebrow">{s.ref}</span>
                  </li>
                ))}
              </ol>
            </>
          )}
        </motion.aside>
      </div>
      <div className="block">
        <Correlation
          key={route.id}
          title={`סיפורים ב${route.he}`}
          initial="time"
          stories={STORIES.filter((s) => route.stops.some((st) => st.storyIds.includes(s.id)))}
        />
      </div>
      <p className="source-line">מיקומים סכמטיים, לא בקנה מידה. הזיהוי של כל תחנה לפי המקרא ולפי מחקר ארכיאולוגי.</p>
    </div>
  );
}
