import type { CellType, Pos } from '../algorithms/types';
import { isWalkable } from './grid';

/** Fixed neighbor order used by every algorithm: up, right, down, left. */
export const DIRECTIONS: readonly Pos[] = [
  { row: -1, col: 0 },
  { row: 0, col: 1 },
  { row: 1, col: 0 },
  { row: 0, col: -1 },
];

/** Walkable 4-directional neighbors of `pos`, in up, right, down, left order. */
export function neighbors(grid: CellType[][], pos: Pos): Pos[] {
  const result: Pos[] = [];
  for (const d of DIRECTIONS) {
    const next = { row: pos.row + d.row, col: pos.col + d.col };
    if (isWalkable(grid, next)) result.push(next);
  }
  return result;
}
