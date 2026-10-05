import { describe, expect, it } from 'vitest';
import { bfs } from '../src/algorithms/bfs';
import { KNOWN_GRIDS, expectValidPath, parseGrid, run } from './helpers';

describe('bfs', () => {
  it.each(KNOWN_GRIDS)('finds the shortest path: $name', ({ rows, shortest }) => {
    const input = parseGrid(rows);
    const { path, done } = run(bfs, input);
    expect(done.found).toBe(true);
    expect(done.pathLength).toBe(shortest);
    expectValidPath(input, path);
  });

  it('expands nodes in breadth-first order', () => {
    const { visitedNodes } = run(bfs, parseGrid(['...', '.S.', '..E']));
    // Distance-1 ring first (up, right, down, left), then distance 2.
    expect(visitedNodes.slice(0, 5)).toEqual([
      { row: 1, col: 1 },
      { row: 0, col: 1 },
      { row: 1, col: 2 },
      { row: 2, col: 1 },
      { row: 1, col: 0 },
    ]);
  });
});
