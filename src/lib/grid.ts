import type { CellType, Pos } from '../algorithms/types';

export function gridRows(grid: CellType[][]): number {
  return grid.length;
}

export function gridCols(grid: CellType[][]): number {
  return grid[0]?.length ?? 0;
}

export function inBounds(grid: CellType[][], pos: Pos): boolean {
  return pos.row >= 0 && pos.row < gridRows(grid) && pos.col >= 0 && pos.col < gridCols(grid);
}

/** True when the position is inside the grid and not a wall. */
export function isWalkable(grid: CellType[][], pos: Pos): boolean {
  return inBounds(grid, pos) && grid[pos.row]?.[pos.col] !== 'wall';
}

/** Unique integer key for a position, for use in Maps, Sets and typed arrays. */
export function posKey(pos: Pos, cols: number): number {
  return pos.row * cols + pos.col;
}

export function keyToPos(key: number, cols: number): Pos {
  return { row: Math.floor(key / cols), col: key % cols };
}

export function samePos(a: Pos, b: Pos): boolean {
  return a.row === b.row && a.col === b.col;
}

export function createEmptyGrid(rows: number, cols: number): CellType[][] {
  return Array.from({ length: rows }, () => Array.from({ length: cols }, () => 'empty' as const));
}

/**
 * Copy-on-write updates for a 2D array: each touched row is copied once and
 * untouched rows keep their identity, so memoized cells skip re-rendering.
 */
export function gridWriter<T>(cells: T[][]) {
  let next: T[][] | undefined;
  const copiedRows = new Set<number>();
  return {
    set(pos: Pos, value: T) {
      next ??= cells.slice();
      if (!copiedRows.has(pos.row)) {
        next[pos.row] = next[pos.row]!.slice();
        copiedRows.add(pos.row);
      }
      next[pos.row]![pos.col] = value;
    },
    /** The updated grid, or the original if nothing changed. */
    result: (): T[][] => next ?? cells,
  };
}
