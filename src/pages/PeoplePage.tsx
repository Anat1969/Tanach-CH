import { useState } from 'react';
import Rich from '../components/Rich';
import { KIND_LABEL, PEOPLE, RELATIONS, type RelationKind } from '../content/people';
import RelationGraph from '../components/RelationGraph';

const KIND_COLOR: Record<RelationKind, string> = {
  family: '#a65d2e',
  conflict: '#b3261e',
  bond: '#4f6b3a',
};

export default function PeoplePage() {
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
        <p className="eyebrow">דמויות · קשרים · פסוקים</p>
        <h1>כל קשר יש לו מקור.</h1>
        <p className="lead">
          <Rich text="בחרו **דמות**, וראו את הקשרים שלה. לכל קשר יש **פסוק** שמעיד עליו, ואין קשר בלי מקור." />
        </p>
      </header>

      <div className="chip-cloud" role="group" aria-label="בחירת דמות">
        {PEOPLE.map((p) => (
          <button
            key={p.id}
            type="button"
            className={`chip press${p.id === selected ? ' is-active' : ''}`}
            aria-pressed={p.id === selected}
            onClick={() => setSelected(p.id)}
          >
            {p.he} <span className="en">({p.en})</span>
          </button>
        ))}
      </div>

      <section className="panel rel-panel">
        <RelationGraph centerId={selected} related={related} onPick={setSelected} />
        <p className="eyebrow">
          <span className="num">{related.length}</span> קשרים · {person.he}
        </p>
        <ul className="rel-list">
          {related.map((r) => (
            <li key={`${r.a}-${r.b}-${r.label}`} className="rel" style={{ borderInlineStartColor: KIND_COLOR[r.kind] }}>
              <span className="rel-kind" style={{ color: KIND_COLOR[r.kind] }}>
                {KIND_LABEL[r.kind]}
              </span>
              <h3>
                {person.he} ↔ {name(r.other)}
              </h3>
              <p>{r.label}</p>
              <p className="source">מקור: {r.ref}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
