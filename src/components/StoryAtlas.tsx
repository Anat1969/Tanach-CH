import { useState } from 'react';
import TimeTrack from './TimeTrack';
import RouteMap from './RouteMap';
import FamilyTree from './FamilyTree';
import { ROUTES } from '../content/route';
import { TREES } from '../content/families';
import { TIMELINE, ERA_SPAN } from '../content/timeline';
import { ART } from '../content/art';
import { ERA_CONTEXT } from '../content/context';
import type { Story } from '../types';

// One picture for a set of stories: the year scale, the map, and the family trees, linked by the story in focus.
// Choosing a story in the strip lights its point on the time scale, its stop on the map, and its people in the tree.
export default function StoryAtlas({ stories }: { stories: Story[] }) {
  const [focusId, setFocusId] = useState(stories[0]?.id ?? '');
  const story = stories.find((s) => s.id === focusId) ?? stories[0];
  if (!story) return null;

  const event = TIMELINE.find((e) => e.storyId === story.id);
  const route = ROUTES.find((r) => r.stops.some((st) => st.storyIds.includes(story.id)));
  const stopIds = route ? route.stops.filter((st) => st.storyIds.includes(story.id)).map((st) => st.id) : [];
  // Stories in the set that have a place on the map, for the highlighted stops across the set.
  const setStopIds = route ? route.stops.filter((st) => stories.some((s) => st.storyIds.includes(s.id))).map((st) => st.id) : [];
  const tree = TREES.find((t) => t.nodes.some((n) => story.people.includes(n.id)));
  const context = ERA_CONTEXT[story.era];
  const span = ERA_SPAN[story.era];
  const art = ART[story.id];

  return (
    <div className="atlas">
      <nav className="atlas-strip" aria-label="בחירת סיפור">
        {stories.map((s) => (
          <button
            key={s.id}
            type="button"
            className={`chip press${s.id === story.id ? ' is-active' : ''}`}
            aria-pressed={s.id === story.id}
            onClick={() => setFocusId(s.id)}
          >
            {s.title}
          </button>
        ))}
      </nav>

      <section className="atlas-focus">
        <div className="atlas-head">
          <p className="eyebrow">
            {story.era} · {story.ref}
          </p>
          <h2>{story.title}</h2>
          <p className="atlas-insight">{story.insight}</p>
        </div>

        <div className="atlas-time">
          <p className="eyebrow">זמן</p>
          <TimeTrack highlightEras={[story.era]} highlightIds={event ? [event.id] : []} />
          {!event && (
            <p className="source">
              לסיפור הזה אין אירוע מתוארך בציר. התקופה שלו: {story.era}
              {span[0] !== span[1] && `, בערך ${Math.abs(span[0])} עד ${Math.abs(span[1])} לפנה"ס`}.
            </p>
          )}
        </div>

        <div className="atlas-geo">
          <p className="eyebrow">מקום</p>
          {route && stopIds.length > 0 ? (
            <div className="map-frame">
              <RouteMap
                route={route}
                selectedId={null}
                onSelect={() => undefined}
                playToken={0}
                highlightStopIds={setStopIds}
                zoom="wide"
              />
            </div>
          ) : (
            <p className="muted">לסיפור הזה אין עדיין תחנה במפה.</p>
          )}
        </div>

        <div className="atlas-people">
          <p className="eyebrow">דמויות</p>
          {tree ? (
            <div className="tree-scroll">
              <FamilyTree tree={tree} highlight={story.people} />
            </div>
          ) : (
            <p className="muted">לסיפור הזה אין עדיין עץ משפחתי.</p>
          )}
        </div>

        <div className="atlas-context">
          <p className="eyebrow">החדשות של התקופה: {story.era}</p>
          <p className="source">{context.years}</p>
          <ul className="plain-list">
            {context.facts.map((f) => (
              <li key={f.text}>
                {f.text} <span className="source">מקור: {f.source}</span>
              </li>
            ))}
          </ul>
        </div>

        {art && (
          <figure className="atlas-art">
            <img src={art.src} alt={art.title} loading="lazy" />
            <figcaption className="art-caption">
              {art.title}, {art.artist}, {art.year}. <span className="source">{art.license}</span>
            </figcaption>
          </figure>
        )}

        <p className="atlas-link">
          <a className="chip press" href={`#/stories/${story.id}`}>
            פתיחת הסיפור
          </a>
        </p>
      </section>
    </div>
  );
}
