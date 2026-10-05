import type { Pos } from '../algorithms/types';

export function manhattan(a: Pos, b: Pos): number {
  return Math.abs(a.row - b.row) + Math.abs(a.col - b.col);
}
