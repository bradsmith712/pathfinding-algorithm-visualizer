import { expect } from 'vitest';
import type { Algorithm, AlgorithmInput, CellType, Pos, StepEvent } from '../src/algorithms/types';
import { isWalkable } from '../src/lib/grid';
import { manhattan } from '../src/lib/heuristics';

/**
 * Builds an AlgorithmInput from rows of text:
 * `S` start, `E` end, `#` wall, `.` empty.
 */
export function parseGrid(rows: string[]): AlgorithmInput {
  let start: Pos | undefined;
  let end: Pos | undefined;
  const grid: CellType[][] = rows.map((line, row) =>
    [...line].map((ch, col): CellType => {
      switch (ch) {
        case 'S':
          start = { row, col };
          return 'start';
        case 'E':
          end = { row, col };
          return 'end';
        case '#':
          return 'wall';
        case '.':
          return 'empty';
        default:
          throw new Error(`Unexpected grid character "${ch}"`);
      }
    }),
  );
  if (!start || !end) throw new Error('Grid needs both S and E');
  return { grid, start, end };
}

export interface RunResult {
  events: StepEvent[];
  visitedNodes: Pos[];
  path: Pos[] | undefined;
  done: Extract<StepEvent, { type: 'done' }>;
}

/** Drains the generator and checks the event-stream invariants every algorithm must satisfy. */
export function run(algorithm: Algorithm, input: AlgorithmInput): RunResult {
  const events = [...algorithm(input)];
  const last = events.at(-1);
  if (last?.type !== 'done') throw new Error('Last event must be "done"');

  expect(events.filter((e) => e.type === 'done')).toHaveLength(1);
  const pathEvents = events.filter((e) => e.type === 'path');
  expect(pathEvents.length).toBeLessThanOrEqual(1);

  const visitedNodes = events.flatMap((e) => (e.type === 'visit' ? [e.node] : []));
  expect(last.visited).toBe(visitedNodes.length);
  const uniqueVisited = new Set(visitedNodes.map((p) => `${p.row},${p.col}`));
  expect(uniqueVisited.size).toBe(visitedNodes.length);

  const path = pathEvents[0]?.nodes;
  if (last.found) {
    expect(path).toBeDefined();
    expect(last.pathLength).toBe(path!.length - 1);
  } else {
    expect(path).toBeUndefined();
    expect(last.pathLength).toBe(0);
  }

  return { events, visitedNodes, path, done: last };
}

/** Asserts the path runs start → end through walkable, 4-adjacent cells without repeats. */
export function expectValidPath(input: AlgorithmInput, path: Pos[] | undefined): void {
  expect(path).toBeDefined();
  const nodes = path!;
  expect(nodes[0]).toEqual(input.start);
  expect(nodes.at(-1)).toEqual(input.end);
  for (const node of nodes) expect(isWalkable(input.grid, node)).toBe(true);
  for (let i = 1; i < nodes.length; i++) expect(manhattan(nodes[i - 1]!, nodes[i]!)).toBe(1);
  expect(new Set(nodes.map((p) => `${p.row},${p.col}`)).size).toBe(nodes.length);
}

/** Small deterministic PRNG (mulberry32) so random-grid tests are repeatable. */
export function seededRandom(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Random grid with the given wall density; start top-left, end bottom-right. */
export function randomGrid(
  rows: number,
  cols: number,
  density: number,
  seed: number,
): AlgorithmInput {
  const rand = seededRandom(seed);
  const grid: CellType[][] = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, (): CellType => (rand() < density ? 'wall' : 'empty')),
  );
  const start = { row: 0, col: 0 };
  const end = { row: rows - 1, col: cols - 1 };
  grid[start.row]![start.col] = 'start';
  grid[end.row]![end.col] = 'end';
  return { grid, start, end };
}

/** Known grids with their shortest path lengths (in steps). */
export const KNOWN_GRIDS: { name: string; rows: string[]; shortest: number }[] = [
  { name: 'open corridor', rows: ['S...E'], shortest: 4 },
  {
    name: 'open 5x5',
    rows: ['S....', '.....', '.....', '.....', '....E'],
    shortest: 8,
  },
  {
    name: 'wall with gap at bottom',
    rows: ['S.#..', '..#..', '..#..', '..#..', '....E'],
    shortest: 8,
  },
  {
    name: 'serpentine',
    rows: ['S#...', '.#.#.', '.#.#.', '.#.#.', '...#E'],
    shortest: 16,
  },
  {
    name: 'heuristic trap (greedy goes the wrong way)',
    rows: ['.......', '.#####.', '.....#.', 'S###.#E', '.....#.', '.......'],
    shortest: 10,
  },
];
