import { describe, expect, it } from 'vitest';
import { ALGORITHMS } from '../src/algorithms';
import type { AlgorithmInput } from '../src/algorithms/types';
import { createEmptyGrid } from '../src/lib/grid';
import { expectValidPath, parseGrid, randomGrid, run } from './helpers';

const OPTIMAL = new Set(['astar', 'dijkstra', 'bfs']);

describe.each(ALGORITHMS)('$name edge cases', ({ id, run: algorithm }) => {
  it('reports no path when a wall separates start and end', () => {
    const input = parseGrid(['S.#..', '..#..', '..#.E']);
    const { done, visitedNodes } = run(algorithm, input);
    expect(done.found).toBe(false);
    // Every reachable cell on the start side gets explored before giving up.
    expect(visitedNodes).toHaveLength(6);
  });

  it('handles start equal to end', () => {
    const grid = createEmptyGrid(3, 3);
    const pos = { row: 1, col: 1 };
    grid[1]![1] = 'start';
    const input: AlgorithmInput = { grid, start: pos, end: pos };
    const { done, path } = run(algorithm, input);
    expect(done).toEqual({ type: 'done', found: true, visited: 1, pathLength: 0 });
    expect(path).toEqual([pos]);
  });

  it('reports no path when the start is enclosed', () => {
    const { done } = run(algorithm, parseGrid(['.#...', '#S#..', '.#..E']));
    expect(done.found).toBe(false);
    expect(done.visited).toBe(1);
  });

  it('reports no path when the end is enclosed', () => {
    const { done } = run(algorithm, parseGrid(['S...#.', '...#E#', '....#.']));
    expect(done.found).toBe(false);
  });

  it('finds a path on a grid with no walls', () => {
    const grid = createEmptyGrid(12, 15);
    const input: AlgorithmInput = { grid, start: { row: 2, col: 3 }, end: { row: 9, col: 11 } };
    const { done, path } = run(algorithm, input);
    expect(done.found).toBe(true);
    expectValidPath(input, path);
    if (OPTIMAL.has(id)) expect(done.pathLength).toBe(15);
  });

  it('reports no path when start or end is outside the grid or on a wall', () => {
    const grid = createEmptyGrid(3, 3);
    expect(
      run(algorithm, { grid, start: { row: -1, col: 0 }, end: { row: 2, col: 2 } }).done,
    ).toEqual({ type: 'done', found: false, visited: 0, pathLength: 0 });
    expect(
      run(algorithm, { grid, start: { row: 0, col: 0 }, end: { row: 3, col: 0 } }).done.found,
    ).toBe(false);
    const walled = parseGrid(['S.E']);
    walled.grid[0]![2] = 'wall';
    expect(run(algorithm, walled).done.found).toBe(false);
    expect(
      run(algorithm, { grid: [], start: { row: 0, col: 0 }, end: { row: 0, col: 0 } }).done.found,
    ).toBe(false);
  });

  it('is deterministic', () => {
    for (let seed = 1; seed <= 10; seed++) {
      const input = randomGrid(20, 20, 0.3, seed);
      expect([...algorithm(input)]).toEqual([...algorithm(input)]);
    }
  });

  it('does not mutate the input grid', () => {
    const input = randomGrid(10, 10, 0.3, 7);
    const snapshot = structuredClone(input);
    run(algorithm, input);
    expect(input).toEqual(snapshot);
  });

  it('can be re-run after finishing', () => {
    const input = parseGrid(['S...', '.##.', '...E']);
    expect(run(algorithm, input).events).toEqual(run(algorithm, input).events);
  });
});
