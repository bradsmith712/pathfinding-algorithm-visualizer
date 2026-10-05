import type { AlgorithmInput, Pos, StepEvent } from '../algorithms/types';
import { isWalkable } from './grid';
import { reconstructPath } from './path';

/** Start and end must be inside the grid and not walls for a search to make sense. */
export function hasValidEndpoints({ grid, start, end }: AlgorithmInput): boolean {
  return isWalkable(grid, start) && isWalkable(grid, end);
}

/** Final events for a successful search: the path, then `done`. */
export function* emitFound(
  parents: Map<number, number>,
  end: Pos,
  cols: number,
  visited: number,
): Generator<StepEvent, void, void> {
  const nodes = reconstructPath(parents, end, cols);
  yield { type: 'path', nodes };
  yield { type: 'done', found: true, visited, pathLength: nodes.length - 1 };
}

/** Final event for a search that exhausted the open set without reaching the end. */
export function* emitNotFound(visited: number): Generator<StepEvent, void, void> {
  yield { type: 'done', found: false, visited, pathLength: 0 };
}
