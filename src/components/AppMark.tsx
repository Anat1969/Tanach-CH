// The app icon: four floors of one building, no text. Used in the bar and as the favicon source.
export default function AppMark({ size = 32 }: { size?: number }) {
  return (
    <svg viewBox="0 0 300 300" width={size} height={size} className="app-mark" aria-hidden="true">
      <polygon points="150,70 230,110 150,150 70,110" fill="#5b3a6e" />
      <polygon points="70,110 150,150 150,166 70,126" fill="#37233f" />
      <polygon points="150,150 230,110 230,126 150,166" fill="#4a2f5a" />
      <polygon points="150,130 230,170 150,210 70,170" fill="#1f3558" />
      <polygon points="70,170 150,210 150,226 70,186" fill="#111f38" />
      <polygon points="150,210 230,170 230,186 150,226" fill="#18294a" />
      <polygon points="150,190 230,230 150,270 70,230" fill="#4f6b3a" />
      <polygon points="70,230 150,270 150,286 70,246" fill="#2f4224" />
      <polygon points="150,270 230,230 230,246 150,286" fill="#3e5630" />
    </svg>
  );
}
