import { useState } from 'react';
import Rich from '../components/Rich';
import Stage from '../components/Stage';
import { KIND_LABEL, PEOPLE, RELATIONS, type RelationKind } from '../content/people';
import { STORIES } from '../content/stories';

const KIND_COLOR: Record<RelationKind, string> = {
  family: '#222222',
  conflict: '#000000',
  bond: '#888888',
};

// Topic: relations. Choosing a kind of relation narrows the stage; the family tree zooms in and out.
export default function PeoplePage() {
  const [kind, setKind] = useState<RelationKind | null>(null);
  const stories = STORIES.filter((st) =>
    RELATIONS.some((r) => (kind === null || r.kind === kind) && (st.people.includes(r.a) || st.people.includes(r.b))),
  );
  const [focusId, setFocusId] = useState(stories[0]?.id ?? '');
  const [selected, setSelected] = useState('abraham');
  const person = PEOPLE.find((p) => p.id === selected) ?? PEOPLE[0];
  const name = (id: string) => PEOPLE.find((p) => p.id === id)?.he ?? id;
  const related = RELATIONS.filter((r) => r.a === selected || r.b === selected).map((r) => ({
    ...r,
    other: r.a === selected ? r.b : r.a,
  }));

  return (
    <div className="people-page">
      <header className="page-head">
        <p className="eyebrow">יחסים · עץ משפחתי</p>
        <h1>מי נולד למי, ומי נאבק עם מי.</h1>
        <p className="lead">
          <Rich text="בחרו **סוג קשר**, ואז **דמות**. לכל קשר יש **פסוק** שמעיד עליו, ואין קשר בלי מקור." />
        </p>
      </header>

      <div className="route-switch" role="group" aria-label="סוג מערכת היחסים">
        <button type="button" className={`chip press${kind === null ? ' is-active' : ''}`} aria-pressed={kind === null} onClick={() => setKind(null)}>
          כל הקשרים
        </button>
        {(Object.keys(KIND_LABEL) as RelationKind[]).map((k) => (
          <button key={k} type="button" className={`chip press${kind === k ? ' is-active' : ''}`} aria-pressed={kind === k} onClick={() => setKind(k)}>
            {KIND_LABEL[k]}
          </button>
        ))}
      </div>

      <Stage stories={stories} focusId={focusId} onFocus={setFocusId} />

      <section className="stage-list" aria-label="דמויות">
        <p className="eyebrow">
          דמויות · <span className="num">{related.length}</span> קשרים בין {person.he} לדמויות אחרות
        </p>
        <div className="chip-cloud" role="group" aria-label="בחירת דמות">
          {PEOPLE.map((p) => (
            <button key={p.id} type="button" className={`chip press${p.id === selected ? ' is-active' : ''}`} aria-pressed={p.id === selected} onClick={() => setSelected(p.id)}>
              {p.he} <span className="en">({p.en})</span>
            </button>
          ))}
        </div>
        <ul className="rel-list">
          {related.map((r) => (
            <li key={`${r.a}-${r.b}-${r.label}`} className="rel" style={{ borderInlineStartColor: KIND_COLOR[r.kind] }}>
              <span className="rel-kind" style={{ color: KIND_COLOR[r.kind] }}>{KIND_LABEL[r.kind]}</span>
              <h3>{person.he} ↔ {name(r.other)}</h3>
              <p>{r.label}</p>
              <p className="source">מקור: {r.ref}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
