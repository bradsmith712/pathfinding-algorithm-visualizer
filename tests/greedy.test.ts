import { describe, expect, it } from 'vitest';
import { bfs } from '../src/algorithms/bfs';
import { dijkstra } from '../src/algorithms/dijkstra';
import { greedy } from '../src/algorithms/greedy';
import { KNOWN_GRIDS, expectValidPath, parseGrid, randomGrid, run } from './helpers';

describe('greedy', () => {
  it.each(KNOWN_GRIDS)('finds a valid path: $name', ({ rows, shortest }) => {
    const input = parseGrid(rows);
    const { path, done } = run(greedy, input);
    expect(done.found).toBe(true);
    expect(done.pathLength).toBeGreaterThanOrEqual(shortest);
    expectValidPath(input, path);
  });

  it('finds a path whenever BFS does on random grids', () => {
    for (let seed = 1; seed <= 30; seed++) {
      const input = randomGrid(15, 15, 0.3, seed);
      const reference = run(bfs, input).done;
      const { done, path } = run(greedy, input);
      expect(done.found).toBe(reference.found);
      if (done.found) {
        expect(done.pathLength).toBeGreaterThanOrEqual(reference.pathLength);
        expectValidPath(input, path);
      }
    }
  });

  it('visits fewer nodes than Dijkstra on an open grid', () => {
    const input = randomGrid(20, 20, 0, 1);
    expect(run(greedy, input).done.visited).toBeLessThan(run(dijkstra, input).done.visited);
  });

  it('can return a longer-than-optimal path', () => {
    const lengths = Array.from({ length: 40 }, (_, i) => randomGrid(15, 15, 0.3, i + 1))
      .map((input) => ({ greedy: run(greedy, input).done, bfs: run(bfs, input).done }))
      .filter((r) => r.bfs.found);
    expect(lengths.some((r) => r.greedy.pathLength > r.bfs.pathLength)).toBe(true);
  });
});
