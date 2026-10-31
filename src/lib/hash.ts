import { useEffect, useState } from 'react';

export interface Route {
  parts: string[];
  params: URLSearchParams;
}

// State lives in the address: #/stories/akedah?level=sod, so a copied link opens the same view.
function read(): Route {
  const raw = window.location.hash.replace(/^#\/?/, '');
  const [path, query = ''] = raw.split('?');
  return { parts: path.split('/').filter(Boolean), params: new URLSearchParams(query) };
}

export function useRoute(): Route {
  const [route, setRoute] = useState<Route>(read);
  useEffect(() => {
    const onChange = () => setRoute(read());
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);
  return route;
}

export function setRoute(parts: string[], params?: Record<string, string>): void {
  const query = params ? new URLSearchParams(params).toString() : '';
  window.location.hash = '/' + parts.join('/') + (query ? `?${query}` : '');
}
