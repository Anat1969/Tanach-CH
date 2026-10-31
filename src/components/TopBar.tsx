import AppMark from './AppMark';

const NAV: [string, string][] = [
  ['books', 'ספרים'],
  ['stories', 'סיפורים'],
  ['map', 'מפה'],
  ['time', 'ציר זמן'],
  ['people', 'יחסים'],
  ['journal', 'יומן'],
];

// Standard bar: the app mark and name link home, content navigation follows on the right,
// and the single A&I logo menu sits on the left (end side).
export default function TopBar({ active }: { active: string }) {
  return (
    <header className="topbar">
      <a className="brand" href="#/" aria-label='תנ"ך כמסע, לדף הבית'>
        <AppMark size={30} />
        <span className="brand-name">תנ"ך כמסע</span>
      </a>
      <nav className="nav" aria-label="ניווט ראשי">
        {NAV.map(([id, label]) => (
          <a
            key={id}
            href={`#/${id}`}
            className={`chip press${active === id ? ' is-active' : ''}`}
            aria-current={active === id ? 'page' : undefined}
          >
            {label}
          </a>
        ))}
      </nav>
      <ai-menu className="logo-slot"></ai-menu>
    </header>
  );
}
