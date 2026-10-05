export type Route =
  { page: 'visualize' } | { page: 'learn'; algorithmId?: string } | { page: 'about' };

/** Parses a hash like `#/learn/astar` into a route. Unknown paths fall back to Visualize. */
export function parseHash(hash: string): Route {
  const segments = hash.replace(/^#\/?/, '').split('/').filter(Boolean);
  const [first, second] = segments;
  switch (first) {
    case 'learn':
      return second ? { page: 'learn', algorithmId: second } : { page: 'learn' };
    case 'about':
      return { page: 'about' };
    default:
      return { page: 'visualize' };
  }
}

export function routeToHash(route: Route): string {
  switch (route.page) {
    case 'visualize':
      return '#/';
    case 'learn':
      return route.algorithmId ? `#/learn/${route.algorithmId}` : '#/learn';
    case 'about':
      return '#/about';
  }
}
