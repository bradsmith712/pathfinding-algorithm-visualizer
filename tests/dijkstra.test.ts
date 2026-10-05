import { describe, expect, it } from 'vitest';
import { bfs } from '../src/algorithms/bfs';
import { dijkstra } from '../src/algorithms/dijkstra';
import { KNOWN_GRIDS, expectValidPath, parseGrid, randomGrid, run } from './helpers';

describe('dijkstra', () => {
  it.each(KNOWN_GRIDS)('finds the shortest path: $name', ({ rows, shortest }) => {
    const input = parseGrid(rows);
    const { path, done } = run(dijkstra, input);
    expect(done.found).toBe(true);
    expect(done.pathLength).toBe(shortest);
    expectValidPath(input, path);
  });

  it('matches BFS path length on random grids (uniform cost)', () => {
    for (let seed = 1; seed <= 50; seed++) {
      const input = randomGrid(20, 20, 0.3, seed);
      const reference = run(bfs, input).done;
      const { done, path } = run(dijkstra, input);
      expect(done.found).toBe(reference.found);
      expect(done.pathLength).toBe(reference.pathLength);
      if (done.found) expectValidPath(input, path);
    }
  });
});
