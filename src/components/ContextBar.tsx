import { useRoute } from '../lib/hash';
import { BOOKS } from '../content/books';
import { STORIES } from '../content/stories';
import { ROUTES } from '../content/route';
import { BookSequence } from './BookRail';

// The sticky path of what is open now, with the whole Bible under it: the current book is lit.
export default function ContextBar() {
  const { parts, params } = useRoute();
  const section = parts[0] ?? '';
  const story = section === 'stories' && parts[1] ? STORIES.find((s) => s.id === parts[1]) : undefined;
  const bookId = story?.book ?? (section === 'stories' ? params.get('book') : null) ?? null;
  const book = BOOKS.find((b) => b.id === bookId);
  const crumbs: { label: string; href?: string }[] = [{ label: 'תנ"ך', href: '#/books' }];

  if (section === 'books') {
    crumbs.push({ label: 'ספרים' });
  } else if (section === 'stories') {
    crumbs.push({ label: 'סיפורים', href: book ? `#/stories?book=${book.id}` : '#/stories' });
    if (book) crumbs.push({ label: book.he, href: `#/stories?book=${book.id}` });
    if (story) crumbs.push({ label: story.title });
  } else if (section === 'map') {
    const route = ROUTES.find((r) => r.id === params.get('route')) ?? ROUTES[0];
    crumbs.push({ label: 'מפה' }, { label: route.he });
  } else if (section === 'time') {
    crumbs.push({ label: 'ציר זמן' });
  } else if (section === 'people') {
    crumbs.push({ label: 'יחסים' });
  } else if (section === 'journal') {
    crumbs.push({ label: 'יומן' });
  }

  return (
    <div className="contextbar">
      <nav className="crumbs" aria-label="מיקום נוכחי">
        {crumbs.map((c, i) => (
          <span key={`${c.label}-${i}`} className="crumb">
            {c.href && i < crumbs.length - 1 ? <a href={c.href}>{c.label}</a> : <strong>{c.label}</strong>}
            {i < crumbs.length - 1 && <span className="crumb-sep" aria-hidden="true">›</span>}
          </span>
        ))}
      </nav>
      <div className="global-rail">
        <BookSequence compact current={book?.id} />
      </div>
    </div>
  );
}
