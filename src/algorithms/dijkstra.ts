import { gridCols, posKey, samePos } from '../lib/grid';
import { neighbors } from '../lib/neighbors';
import { PriorityQueue } from '../lib/priorityQueue';
import { emitFound, emitNotFound, hasValidEndpoints } from '../lib/search';
import type { Algorithm, Pos } from './types';

const EDGE_COST = 1;

/** Dijkstra's algorithm: priority queue ordered by distance from start (g). */
export const dijkstra: Algorithm = function* (input) {
  const { grid, start, end } = input;
  if (!hasValidEndpoints(input)) return yield* emitNotFound(0);

  const cols = gridCols(grid);
  const parents = new Map<number, number>();
  const dist = new Map<number, number>([[posKey(start, cols), 0]]);
  const closed = new Set<number>();
  const open = new PriorityQueue<{ node: Pos; g: number }>((a, b) => a.g - b.g);
  open.push({ node: start, g: 0 });
  let visited = 0;

  while (!open.isEmpty()) {
    const { node: current, g } = open.pop()!;
    const currentKey = posKey(current, cols);
    // Skip stale queue entries left behind when a shorter distance was found.
    if (closed.has(currentKey)) continue;
    closed.add(currentKey);

    visited++;
    yield { type: 'visit', node: current };
    if (samePos(current, end)) return yield* emitFound(parents, end, cols, visited);

    for (const next of neighbors(grid, current)) {
      const key = posKey(next, cols);
      if (closed.has(key)) continue;
      const tentative = g + EDGE_COST;
      if (tentative >= (dist.get(key) ?? Infinity)) continue;
      dist.set(key, tentative);
      parents.set(key, currentKey);
      open.push({ node: next, g: tentative });
      yield { type: 'frontier', node: next };
    }
  }

  yield* emitNotFound(visited);
};
