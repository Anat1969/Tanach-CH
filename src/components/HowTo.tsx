// A how-to note. It has its own look (dashed frame, a label) so it never reads as content.
export default function HowTo({ children }: { children: React.ReactNode }) {
  return (
    <aside className="howto" aria-label="הוראה לתפעול">
      <p className="howto-label">הוראה לתפעול</p>
      <p>{children}</p>
    </aside>
  );
}
