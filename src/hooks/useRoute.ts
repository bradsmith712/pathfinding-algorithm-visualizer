import { useSyncExternalStore } from 'react';
import { parseHash, type Route } from '../lib/router';

function subscribe(onChange: () => void): () => void {
  window.addEventListener('hashchange', onChange);
  return () => window.removeEventListener('hashchange', onChange);
}

function getHash(): string {
  return window.location.hash;
}

export function useRoute(): Route {
  const hash = useSyncExternalStore(subscribe, getHash);
  return parseHash(hash);
}
