import { useEffect, useRef, useState } from 'react';
import { STORIES } from '../content/stories';
import { loadJournal, saveJournal, type Journal } from '../lib/storage';

type Status = { kind: 'idle' } | { kind: 'saved'; at: string } | { kind: 'error' };

// Minimal typing for the browser's speech recognition (not in every TypeScript lib).
interface SpeechRec {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((e: { resultIndex: number; results: ArrayLike<{ isFinal: boolean; 0: { transcript: string } }> }) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
}

function speechCtor(): (new () => SpeechRec) | null {
  const w = window as unknown as { SpeechRecognition?: new () => SpeechRec; webkitSpeechRecognition?: new () => SpeechRec };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export default function JournalPage() {
  const [journal, setJournal] = useState<Journal>(loadJournal);
  const [status, setStatus] = useState<Status>({ kind: 'idle' });
  const [recording, setRecording] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const rec = useRef<SpeechRec | null>(null);
  const Ctor = speechCtor();

  useEffect(() => () => rec.current?.stop(), []);

  const update = (id: string, text: string) => {
    const next: Journal = { ...journal, [id]: { text, updated: new Date().toISOString() } };
    setJournal(next);
    const ok = saveJournal(next);
    setStatus(ok ? { kind: 'saved', at: new Date().toLocaleTimeString('he-IL') } : { kind: 'error' });
  };

  // Dictation: the browser transcribes the speech; the text goes into this story's note.
  const toggleRecord = (id: string) => {
    if (!Ctor) {
      setNote('התמלול הקולי אינו זמין בדפדפן הזה. בדפדפן Chrome בשולחן העבודה הוא פועל. אפשר להקליד כרגיל.');
      return;
    }
    if (recording === id) {
      rec.current?.stop();
      setRecording(null);
      return;
    }
    rec.current?.stop();
    const r = new Ctor();
    r.lang = 'he-IL';
    r.continuous = true;
    r.interimResults = false;
    let base = journal[id]?.text ?? '';
    r.onresult = (e) => {
      let added = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) added += e.results[i][0].transcript;
      }
      if (added) {
        base = `${base}${base && !base.endsWith(' ') ? ' ' : ''}${added.trim()}`;
        update(id, base);
      }
    };
    r.onerror = () => {
      setNote('לא הצלחנו להקליט. בדקו את ההרשאה למיקרופון.');
      setRecording(null);
    };
    r.onend = () => setRecording((cur) => (cur === id ? null : cur));
    rec.current = r;
    setNote(null);
    r.start();
    setRecording(id);
  };

  return (
    <div className="journal-page">
      <header className="page-head">
        <p className="eyebrow">יומן אישי · נשמר בדפדפן</p>
        <h1>מה נשאר איתך מהסיפור?</h1>
        <p className="lead">כתבו, או הקליטו והתמלול יופיע בתיבה. ההערות נשמרות אוטומטית בדפדפן.</p>
      </header>

      <p className="save-status" role="status" aria-live="polite">
        {status.kind === 'saved' && `נשמר ב-${status.at}`}
        {status.kind === 'error' && 'השמירה נכשלה. הדפדפן חוסם אחסון, אז ההערה תישאר בחלון הזה בלבד.'}
        {note && ` ${note}`}
      </p>

      <div className="journal-grid">
        {STORIES.map((s) => (
          <section key={s.id} className="journal-entry">
            <div className="journal-head">
              <a href={`#/stories/${s.id}`}>{s.title}</a>
              <button
                type="button"
                className={`chip press${recording === s.id ? ' is-active' : ''}`}
                aria-pressed={recording === s.id}
                onClick={() => toggleRecord(s.id)}
              >
                {recording === s.id ? 'עצירת ההקלטה' : 'הקלטה ותמלול'}
              </button>
            </div>
            <label className="visually-hidden" htmlFor={`j-${s.id}`}>
              הערה לסיפור {s.title}
            </label>
            <textarea id={`j-${s.id}`} className="field" rows={4} value={journal[s.id]?.text ?? ''} onChange={(e) => update(s.id, e.target.value)} />
          </section>
        ))}
      </div>
    </div>
  );
}
