import { describe, expect, it } from 'vitest';
import { astar } from '../src/algorithms/astar';
import { dijkstra } from '../src/algorithms/dijkstra';
import { KNOWN_GRIDS, expectValidPath, parseGrid, randomGrid, run } from './helpers';

describe('astar', () => {
  it.each(KNOWN_GRIDS)('finds the shortest path: $name', ({ rows, shortest }) => {
    const input = parseGrid(rows);
    const { path, done } = run(astar, input);
    expect(done.found).toBe(true);
    expect(done.pathLength).toBe(shortest);
    expect(done.pathLength).toBe(run(dijkstra, input).done.pathLength);
    expectValidPath(input, path);
  });

  it('matches Dijkstra path length on random grids', () => {
    for (let seed = 1; seed <= 50; seed++) {
      for (const density of [0.1, 0.25, 0.35]) {
        const input = randomGrid(20, 25, density, seed);
        const reference = run(dijkstra, input).done;
        const { done, path } = run(astar, input);
        expect(done.found).toBe(reference.found);
        expect(done.pathLength).toBe(reference.pathLength);
        if (done.found) expectValidPath(input, path);
      }
    }
  });

  it('visits fewer nodes than Dijkstra on an open grid', () => {
    const input = randomGrid(20, 20, 0, 1);
    expect(run(astar, input).done.visited).toBeLessThan(run(dijkstra, input).done.visited);
  });

  it('heads straight for the goal on an open grid', () => {
    const input = randomGrid(10, 10, 0, 1);
    const { done } = run(astar, input);
    // Tie-breaking on lower h means only nodes on one shortest path get expanded.
    expect(done.visited).toBe(done.pathLength + 1);
  });
});
