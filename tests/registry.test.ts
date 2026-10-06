import { describe, expect, it } from 'vitest';
import { ALGORITHMS, DEFAULT_ALGORITHM_ID, getAlgorithm, isAlgorithmId } from '../src/algorithms';

describe('algorithm registry', () => {
  it('lists all five algorithms in display order with unique ids', () => {
    expect(ALGORITHMS.map((a) => a.id)).toEqual(['astar', 'dijkstra', 'bfs', 'dfs', 'greedy']);
  });

  it('has a short name for every algorithm', () => {
    expect(ALGORITHMS.map((a) => a.shortName)).toEqual([
      'A*',
      "Dijkstra's",
      'BFS',
      'DFS',
      'Greedy Best-First',
    ]);
  });

  it('looks up algorithms by id', () => {
    expect(getAlgorithm('bfs').name).toBe('Breadth-First Search (BFS)');
    expect(getAlgorithm(DEFAULT_ALGORITHM_ID).id).toBe('astar');
  });

  it('validates ids', () => {
    expect(isAlgorithmId('dfs')).toBe(true);
    expect(isAlgorithmId('nope')).toBe(false);
  });
});
