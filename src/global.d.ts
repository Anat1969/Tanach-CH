// The A&I logo menu is a custom element loaded from appofapp-gh.vercel.app (see index.html).
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'ai-menu': Record<string, unknown> & { className?: string };
      'app-creations': Record<string, unknown> & { src?: string; heading?: string };
    }
  }
}

export {};
