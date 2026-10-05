import { describe, expect, it } from 'vitest';
import { createEmptyGrid, inBounds, isWalkable, keyToPos, posKey } from '../src/lib/grid';
import { manhattan } from '../src/lib/heuristics';
import { neighbors } from '../src/lib/neighbors';
import { reconstructPath } from '../src/lib/path';
import { PriorityQueue } from '../src/lib/priorityQueue';
import { parseGrid } from './helpers';

describe('grid helpers', () => {
  const grid = createEmptyGrid(3, 4);

  it('creates a grid of the requested size', () => {
    expect(grid).toHaveLength(3);
    expect(grid.every((row) => row.length === 4 && row.every((c) => c === 'empty'))).toBe(true);
  });

  it('checks bounds', () => {
    expect(inBounds(grid, { row: 0, col: 0 })).toBe(true);
    expect(inBounds(grid, { row: 2, col: 3 })).toBe(true);
    expect(inBounds(grid, { row: -1, col: 0 })).toBe(false);
    expect(inBounds(grid, { row: 3, col: 0 })).toBe(false);
    expect(inBounds(grid, { row: 0, col: 4 })).toBe(false);
  });

  it('treats walls and out-of-bounds cells as not walkable', () => {
    const { grid: g } = parseGrid(['S#E']);
    expect(isWalkable(g, { row: 0, col: 0 })).toBe(true);
    expect(isWalkable(g, { row: 0, col: 1 })).toBe(false);
    expect(isWalkable(g, { row: 0, col: 3 })).toBe(false);
  });

  it('round-trips position keys', () => {
    const pos = { row: 2, col: 3 };
    expect(keyToPos(posKey(pos, 4), 4)).toEqual(pos);
  });
});

describe('neighbors', () => {
  it('returns up, right, down, left in that order', () => {
    const grid = createEmptyGrid(3, 3);
    expect(neighbors(grid, { row: 1, col: 1 })).toEqual([
      { row: 0, col: 1 },
      { row: 1, col: 2 },
      { row: 2, col: 1 },
      { row: 1, col: 0 },
    ]);
  });

  it('skips walls and cells outside the grid', () => {
    const { grid } = parseGrid(['S#', 'E.']);
    expect(neighbors(grid, { row: 0, col: 0 })).toEqual([{ row: 1, col: 0 }]);
  });
});

describe('manhattan', () => {
  it('sums row and column distance', () => {
    expect(manhattan({ row: 0, col: 0 }, { row: 3, col: 4 })).toBe(7);
    expect(manhattan({ row: 5, col: 2 }, { row: 1, col: 6 })).toBe(8);
    expect(manhattan({ row: 1, col: 1 }, { row: 1, col: 1 })).toBe(0);
  });
});

describe('reconstructPath', () => {
  it('follows parent links back to the start', () => {
    const cols = 3;
    const parents = new Map<number, number>([
      [posKey({ row: 0, col: 1 }, cols), posKey({ row: 0, col: 0 }, cols)],
      [posKey({ row: 1, col: 1 }, cols), posKey({ row: 0, col: 1 }, cols)],
    ]);
    expect(reconstructPath(parents, { row: 1, col: 1 }, cols)).toEqual([
      { row: 0, col: 0 },
      { row: 0, col: 1 },
      { row: 1, col: 1 },
    ]);
  });

  it('returns just the node when it has no parent', () => {
    expect(reconstructPath(new Map(), { row: 2, col: 2 }, 5)).toEqual([{ row: 2, col: 2 }]);
  });
});

describe('PriorityQueue', () => {
  it('pops items in priority order', () => {
    const pq = new PriorityQueue<number>((a, b) => a - b);
    for (const n of [5, 3, 8, 1, 9, 2, 7]) pq.push(n);
    const out: number[] = [];
    while (!pq.isEmpty()) out.push(pq.pop()!);
    expect(out).toEqual([1, 2, 3, 5, 7, 8, 9]);
  });

  it('breaks ties by insertion order', () => {
    const pq = new PriorityQueue<{ p: number; id: string }>((a, b) => a.p - b.p);
    const items = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].map((id, i) => ({ p: i % 2, id }));
    for (const item of items) pq.push(item);
    const out: string[] = [];
    while (pq.size > 0) out.push(pq.pop()!.id);
    expect(out).toEqual(['a', 'c', 'e', 'g', 'b', 'd', 'f', 'h']);
  });

  it('returns undefined when empty', () => {
    expect(new PriorityQueue<number>((a, b) => a - b).pop()).toBeUndefined();
  });
});
