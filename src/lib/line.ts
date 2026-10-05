import type { Pos } from '../algorithms/types';

/**
 * Cells on the straight line from `a` to `b`, inclusive (Bresenham). Used to
 * fill gaps when a fast drag skips over cells between two pointer events.
 */
export function lineBetween(a: Pos, b: Pos): Pos[] {
  const cells: Pos[] = [];
  const dRow = Math.abs(b.row - a.row);
  const dCol = Math.abs(b.col - a.col);
  const stepRow = a.row < b.row ? 1 : -1;
  const stepCol = a.col < b.col ? 1 : -1;
  let err = dCol - dRow;
  let { row, col } = a;

  for (;;) {
    cells.push({ row, col });
    if (row === b.row && col === b.col) return cells;
    const e2 = 2 * err;
    if (e2 > -dRow) {
      err -= dRow;
      col += stepCol;
    }
    if (e2 < dCol) {
      err += dCol;
      row += stepRow;
    }
  }
}
