import { gridCols, posKey, samePos } from '../lib/grid';
import { manhattan } from '../lib/heuristics';
import { neighbors } from '../lib/neighbors';
import { PriorityQueue } from '../lib/priorityQueue';
import { emitFound, emitNotFound, hasValidEndpoints } from '../lib/search';
import type { Algorithm, Pos } from './types';

/**
 * Greedy best-first search: priority queue ordered only by the heuristic h
 * (Manhattan distance to the end). Fast, but the path is not guaranteed shortest.
 */
export const greedy: Algorithm = function* (input) {
  const { grid, start, end } = input;
  if (!hasValidEndpoints(input)) return yield* emitNotFound(0);

  const cols = gridCols(grid);
  const parents = new Map<number, number>();
  const discovered = new Set<number>([posKey(start, cols)]);
  const open = new PriorityQueue<{ node: Pos; h: number }>((a, b) => a.h - b.h);
  open.push({ node: start, h: manhattan(start, end) });
  let visited = 0;

  while (!open.isEmpty()) {
    const { node: current } = open.pop()!;
    visited++;
    yield { type: 'visit', node: current };
    if (samePos(current, end)) return yield* emitFound(parents, end, cols, visited);

    const currentKey = posKey(current, cols);
    for (const next of neighbors(grid, current)) {
      const key = posKey(next, cols);
      if (discovered.has(key)) continue;
      discovered.add(key);
      parents.set(key, currentKey);
      open.push({ node: next, h: manhattan(next, end) });
      yield { type: 'frontier', node: next };
    }
  }

  yield* emitNotFound(visited);
};
