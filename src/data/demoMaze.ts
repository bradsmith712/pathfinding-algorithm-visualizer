import { gridFromRows } from '../lib/grid';

/**
 * Preset maze for the Learn page mini-demo (14 × 8, as in docs/learn.png).
 * Chosen so the algorithms behave visibly differently (path length / visited):
 * A* 16/32, Dijkstra and BFS 16/78, Greedy 24/37, DFS 46/52.
 */
export const DEMO_MAZE_ROWS = [
  '.#.##....#....',
  '.S............',
  '...##....#....',
  '..##..#.....##',
  '........#..#.#',
  '.#....#..##...',
  '#.....#.....E#',
  '....##.#.###..',
] as const;

export const DEMO_MAZE = gridFromRows(DEMO_MAZE_ROWS);
