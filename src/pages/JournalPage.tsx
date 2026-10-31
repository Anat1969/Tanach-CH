import { useState } from 'react';
import { STORIES } from '../content/stories';
import { loadJournal, saveJournal, type Journal } from '../lib/storage';

type Status = { kind: 'idle' } | { kind: 'saved'; at: string } | { kind: 'error' };

export default function JournalPage() {
  const [journal, setJournal] = useState<Journal>(loadJournal);
  const [status, setStatus] = useState<Status>({ kind: 'idle' });

  const update = (id: string, text: string) => {
    const next: Journal = { ...journal, [id]: { text, updated: new Date().toISOString() } };
    setJournal(next);
    const ok = saveJournal(next);
    setStatus(ok ? { kind: 'saved', at: new Date().toLocaleTimeString('he-IL') } : { kind: 'error' });
  };

  return (
    <div className="journal-page">
      <header className="page-head">
        <p className="eyebrow">יומן אישי · נשמר בדפדפן</p>
        <h1>מה נשאר איתך מהסיפור?</h1>
        <p className="lead">כתבו הערה לכל סיפור. ההערות נשמרות אוטומטית, ונשארות גם אחרי רענון.</p>
      </header>

      <p className="save-status" role="status" aria-live="polite">
        {status.kind === 'saved' && `נשמר ב-${status.at}`}
        {status.kind === 'error' &&
          'השמירה נכשלה. הדפדפן חוסם אחסון, אז ההערה תישאר רק בחלון הזה. פתחו את האתר בחלון רגיל כדי לשמור.'}
      </p>

      <div className="grid journal-grid">
        {STORIES.map((s) => (
          <section key={s.id} className="card">
            <p className="eyebrow">{s.ref}</p>
            <h2>
              <a href={`#/stories/${s.id}`}>{s.title}</a>
            </h2>
            <label className="field-label" htmlFor={`j-${s.id}`}>
              מה הפתיע אותך בסיפור הזה?
            </label>
            <textarea
              id={`j-${s.id}`}
              className="field"
              rows={4}
              value={journal[s.id]?.text ?? ''}
              onChange={(e) => update(s.id, e.target.value)}
            />
          </section>
        ))}
      </div>
    </div>
  );
}
