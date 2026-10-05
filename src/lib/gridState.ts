import type { CellType, Pos } from '../algorithms/types';
import { DEFAULT_END, DEFAULT_START, GRID_COLS, GRID_ROWS } from './constants';
import { createEmptyGrid, inBounds, samePos } from './grid';

export type DrawTool = 'wall' | 'erase' | 'start' | 'end';
export type Tool = 'select' | DrawTool;

/**
 * The maze itself: walls plus the start and end markers. `cells` always holds
 * exactly one 'start' and one 'end', at `start` and `end`. Visited/path
 * overlays are kept elsewhere so they can be cleared without touching this.
 */
export interface GridState {
  cells: CellType[][];
  start: Pos;
  end: Pos;
}

export type GridAction =
  /** Apply a drawing tool to cells. For start/end only the last position counts. */
  { type: 'paint'; tool: DrawTool; positions: Pos[] } | { type: 'clearWalls' };

export function createGridState(
  rows: number = GRID_ROWS,
  cols: number = GRID_COLS,
  start: Pos = DEFAULT_START,
  end: Pos = DEFAULT_END,
): GridState {
  const cells = createEmptyGrid(rows, cols);
  cells[start.row]![start.col] = 'start';
  cells[end.row]![end.col] = 'end';
  return { cells, start, end };
}

/**
 * Copy-on-write cell updates: each touched row is copied once, untouched rows
 * keep their identity so memoized rows and cells skip re-rendering.
 */
function cellWriter(cells: CellType[][]) {
  let next: CellType[][] | undefined;
  const copiedRows = new Set<number>();
  return {
    set(pos: Pos, type: CellType) {
      next ??= cells.slice();
      if (!copiedRows.has(pos.row)) {
        next[pos.row] = next[pos.row]!.slice();
        copiedRows.add(pos.row);
      }
      next[pos.row]![pos.col] = type;
    },
    /** The updated grid, or the original if nothing changed. */
    result: () => next ?? cells,
  };
}

function paint(state: GridState, tool: DrawTool, positions: Pos[]): GridState {
  const { cells } = state;
  const valid = positions.filter((p) => inBounds(cells, p));

  if (tool === 'start' || tool === 'end') {
    const target = valid.at(-1);
    const current = tool === 'start' ? state.start : state.end;
    const other = tool === 'start' ? state.end : state.start;
    if (!target || samePos(target, current) || samePos(target, other)) return state;
    const writer = cellWriter(cells);
    writer.set(current, 'empty');
    writer.set(target, tool);
    return { ...state, cells: writer.result(), [tool]: target };
  }

  // Walls only go on empty cells, so start and end can't be overwritten.
  const [from, to]: [CellType, CellType] = tool === 'wall' ? ['empty', 'wall'] : ['wall', 'empty'];
  const writer = cellWriter(cells);
  for (const p of valid) {
    if (cells[p.row]![p.col] === from) writer.set(p, to);
  }
  const next = writer.result();
  return next === cells ? state : { ...state, cells: next };
}

function clearWalls(state: GridState): GridState {
  const writer = cellWriter(state.cells);
  state.cells.forEach((row, r) =>
    row.forEach((type, c) => {
      if (type === 'wall') writer.set({ row: r, col: c }, 'empty');
    }),
  );
  const next = writer.result();
  return next === state.cells ? state : { ...state, cells: next };
}

export function gridReducer(state: GridState, action: GridAction): GridState {
  switch (action.type) {
    case 'paint':
      return paint(state, action.tool, action.positions);
    case 'clearWalls':
      return clearWalls(state);
  }
}

export function hasWalls(state: GridState): boolean {
  return state.cells.some((row) => row.includes('wall'));
}
