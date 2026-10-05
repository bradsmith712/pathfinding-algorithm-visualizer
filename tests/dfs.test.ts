import { describe, expect, it } from 'vitest';
import { dfs } from '../src/algorithms/dfs';
import { KNOWN_GRIDS, expectValidPath, parseGrid, randomGrid, run } from './helpers';
import { bfs } from '../src/algorithms/bfs';

describe('dfs', () => {
  it.each(KNOWN_GRIDS)('finds a valid path: $name', ({ rows, shortest }) => {
    const input = parseGrid(rows);
    const { path, done } = run(dfs, input);
    expect(done.found).toBe(true);
    expect(done.pathLength).toBeGreaterThanOrEqual(shortest);
    expectValidPath(input, path);
  });

  it('explores up, right, down, left in that order', () => {
    const { visitedNodes, done } = run(dfs, parseGrid(['...', '.S.', '..E']));
    expect(visitedNodes).toEqual([
      { row: 1, col: 1 },
      { row: 0, col: 1 },
      { row: 0, col: 2 },
      { row: 1, col: 2 },
      { row: 2, col: 2 },
    ]);
    // Optimal is 2; DFS takes the long way round.
    expect(done.pathLength).toBe(4);
  });

  it('finds a path whenever BFS does on random grids', () => {
    for (let seed = 1; seed <= 30; seed++) {
      const input = randomGrid(15, 15, 0.3, seed);
      const reference = run(bfs, input).done;
      const { done, path } = run(dfs, input);
      expect(done.found).toBe(reference.found);
      if (done.found) {
        expect(done.pathLength).toBeGreaterThanOrEqual(reference.pathLength);
        expectValidPath(input, path);
      }
    }
  });
});
