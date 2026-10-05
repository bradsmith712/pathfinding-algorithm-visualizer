import { gridCols, posKey, samePos } from '../lib/grid';
import { manhattan } from '../lib/heuristics';
import { neighbors } from '../lib/neighbors';
import { PriorityQueue } from '../lib/priorityQueue';
import { emitFound, emitNotFound, hasValidEndpoints } from '../lib/search';
import type { Algorithm, Pos } from './types';

const EDGE_COST = 1;

interface OpenEntry {
  node: Pos;
  g: number;
  h: number;
}

/**
 * A* search: priority queue ordered by f = g + h with Manhattan distance as h.
 * Ties go to the lower h (closer to the goal), then to insertion order.
 */
export const astar: Algorithm = function* (input) {
  const { grid, start, end } = input;
  if (!hasValidEndpoints(input)) return yield* emitNotFound(0);

  const cols = gridCols(grid);
  const parents = new Map<number, number>();
  const gScore = new Map<number, number>([[posKey(start, cols), 0]]);
  const closed = new Set<number>();
  const open = new PriorityQueue<OpenEntry>((a, b) => a.g + a.h - (b.g + b.h) || a.h - b.h);
  open.push({ node: start, g: 0, h: manhattan(start, end) });
  let visited = 0;

  while (!open.isEmpty()) {
    const { node: current, g } = open.pop()!;
    const currentKey = posKey(current, cols);
    if (closed.has(currentKey)) continue;
    closed.add(currentKey);

    visited++;
    yield { type: 'visit', node: current };
    if (samePos(current, end)) return yield* emitFound(parents, end, cols, visited);

    for (const next of neighbors(grid, current)) {
      const key = posKey(next, cols);
      if (closed.has(key)) continue;
      const tentative = g + EDGE_COST;
      if (tentative >= (gScore.get(key) ?? Infinity)) continue;
      gScore.set(key, tentative);
      parents.set(key, currentKey);
      open.push({ node: next, g: tentative, h: manhattan(next, end) });
      yield { type: 'frontier', node: next };
    }
  }

  yield* emitNotFound(visited);
};
