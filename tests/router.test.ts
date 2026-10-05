import { describe, expect, it } from 'vitest';
import { parseHash, routeToHash } from '../src/lib/router';

describe('router', () => {
  it('parses known routes', () => {
    expect(parseHash('')).toEqual({ page: 'visualize' });
    expect(parseHash('#/')).toEqual({ page: 'visualize' });
    expect(parseHash('#/learn')).toEqual({ page: 'learn' });
    expect(parseHash('#/learn/astar')).toEqual({ page: 'learn', algorithmId: 'astar' });
    expect(parseHash('#/about')).toEqual({ page: 'about' });
  });

  it('falls back to visualize for unknown paths', () => {
    expect(parseHash('#/nope')).toEqual({ page: 'visualize' });
  });

  it('round-trips routes', () => {
    for (const hash of ['#/', '#/learn', '#/learn/bfs', '#/about']) {
      expect(routeToHash(parseHash(hash))).toBe(hash);
    }
  });
});
