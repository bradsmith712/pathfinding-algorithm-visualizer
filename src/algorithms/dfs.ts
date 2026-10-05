import { gridCols, posKey, samePos } from '../lib/grid';
import { neighbors } from '../lib/neighbors';
import { emitFound, emitNotFound, hasValidEndpoints } from '../lib/search';
import type { Algorithm, Pos } from './types';

/**
 * Depth-first search: explicit stack, explores up, right, down, left in that
 * order (same order as the recursive version). Not guaranteed to be shortest.
 */
export const dfs: Algorithm = function* (input) {
  const { grid, start, end } = input;
  if (!hasValidEndpoints(input)) return yield* emitNotFound(0);

  const cols = gridCols(grid);
  const parents = new Map<number, number>();
  const closed = new Set<number>();
  const stack: { node: Pos; parent?: number }[] = [{ node: start }];
  let visited = 0;

  while (stack.length > 0) {
    const { node: current, parent } = stack.pop()!;
    const currentKey = posKey(current, cols);
    if (closed.has(currentKey)) continue;
    closed.add(currentKey);
    if (parent !== undefined) parents.set(currentKey, parent);

    visited++;
    yield { type: 'visit', node: current };
    if (samePos(current, end)) return yield* emitFound(parents, end, cols, visited);

    // Push in reverse so the first direction (up) is popped and explored first.
    const next = neighbors(grid, current).filter((n) => !closed.has(posKey(n, cols)));
    for (let i = next.length - 1; i >= 0; i--) {
      stack.push({ node: next[i]!, parent: currentKey });
    }
    for (const n of next) yield { type: 'frontier', node: n };
  }

  yield* emitNotFound(visited);
};
