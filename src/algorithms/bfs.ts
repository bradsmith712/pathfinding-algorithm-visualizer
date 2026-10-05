import { gridCols, posKey, samePos } from '../lib/grid';
import { neighbors } from '../lib/neighbors';
import { emitFound, emitNotFound, hasValidEndpoints } from '../lib/search';
import type { Algorithm, Pos } from './types';

/** Breadth-first search: FIFO queue, shortest path on an unweighted grid. */
export const bfs: Algorithm = function* (input) {
  const { grid, start, end } = input;
  if (!hasValidEndpoints(input)) return yield* emitNotFound(0);

  const cols = gridCols(grid);
  const parents = new Map<number, number>();
  const discovered = new Set<number>([posKey(start, cols)]);
  const queue: Pos[] = [start];
  let head = 0;
  let visited = 0;

  while (head < queue.length) {
    const current = queue[head++]!;
    visited++;
    yield { type: 'visit', node: current };
    if (samePos(current, end)) return yield* emitFound(parents, end, cols, visited);

    const currentKey = posKey(current, cols);
    for (const next of neighbors(grid, current)) {
      const key = posKey(next, cols);
      if (discovered.has(key)) continue;
      discovered.add(key);
      parents.set(key, currentKey);
      queue.push(next);
      yield { type: 'frontier', node: next };
    }
  }

  yield* emitNotFound(visited);
};
