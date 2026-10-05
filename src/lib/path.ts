import type { Pos } from '../algorithms/types';
import { keyToPos, posKey } from './grid';

/**
 * Walks parent links back from `end` and returns the path from start to end.
 * `parents` maps a node key to its predecessor key; the start node has no entry.
 */
export function reconstructPath(parents: Map<number, number>, end: Pos, cols: number): Pos[] {
  const path: Pos[] = [];
  let key: number | undefined = posKey(end, cols);
  while (key !== undefined) {
    path.push(keyToPos(key, cols));
    key = parents.get(key);
  }
  return path.reverse();
}
