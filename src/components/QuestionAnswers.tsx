import { useState } from 'react';

const KEY = 'tanach.answers.v1';
type Store = Record<string, string>;

function load(): Store {
  try {
    return JSON.parse(window.localStorage.getItem(KEY) ?? '{}') as Store;
  } catch {
    return {};
  }
}

function save(store: Store): boolean {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(store));
    return true;
  } catch {
    return false;
  }
}

// Each question opens to its own answer. Answers are kept in this browser, per story and question.
export default function QuestionAnswers({ storyId, questions }: { storyId: string; questions: string[] }) {
  const [store, setStore] = useState<Store>(load);
  const [saved, setSaved] = useState(true);
  return (
    <div className="qa">
      {questions.map((q, i) => {
        const key = `${storyId}:${i}`;
        return (
          <details key={key} className="qa-item">
            <summary>{q}</summary>
            <textarea
              className="field"
              rows={3}
              value={store[key] ?? ''}
              placeholder="התשובה שלך"
              onChange={(e) => {
                const next = { ...store, [key]: e.target.value };
                setStore(next);
                setSaved(save(next));
              }}
            />
          </details>
        );
      })}
      <p className="save-status" role="status" aria-live="polite">
        {saved ? 'התשובות נשמרות בדפדפן' : 'השמירה נכשלה. הדפדפן חוסם אחסון.'}
      </p>
    </div>
  );
}
