import { useState } from 'react';
import RouteMap from '../components/RouteMap';
import Rich from '../components/Rich';
import { ROUTES } from '../content/route';
import { STORIES } from '../content/stories';
import { setRoute } from '../lib/hash';

interface Props {
  routeId: string | null;
}

export default function MapPage({ routeId }: Props) {
  const route = ROUTES.find((r) => r.id === routeId) ?? ROUTES[0];
  const [selectedId, setSelectedId] = useState<string | null>(null);
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
          <RouteMap route={route} selectedId={selectedId} onSelect={setSelectedId} />
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

        <aside className="panel map-detail">
          {stop ? (
            <>
              <p className="eyebrow">{stop.ref}</p>
              <h2>
                {stop.he} <span className="en">({stop.en})</span>
              </h2>
              <p>
                <Rich text={stop.note} />
              </p>
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
        </aside>
      </div>
      <p className="source-line">מיקומים סכמטיים, לא בקנה מידה. הזיהוי של כל תחנה לפי המקרא ולפי מחקר ארכיאולוגי.</p>
    </div>
  );
}
