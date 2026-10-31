const NAV: [string, string][] = [
  ['books', 'ספרים'],
  ['stories', 'סיפורים'],
  ['map', 'מפה'],
  ['time', 'ציר זמן'],
  ['people', 'יחסים'],
  ['journal', 'יומן'],
];

// Standard bar: app name (home), content navigation, and the single A&I logo menu on the end side.
export default function TopBar({ active }: { active: string }) {
  return (
    <header className="topbar">
      <a className="brand" href="#/">
        תנ"ך כמסע
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
