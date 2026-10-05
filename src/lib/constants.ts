import type { Pos } from '../algorithms/types';

/** Visualize grid dimensions, matching the reference screenshot. */
export const GRID_ROWS = 29;
export const GRID_COLS = 28;

export const DEFAULT_START: Pos = { row: 4, col: 4 };
export const DEFAULT_END: Pos = { row: GRID_ROWS - 5, col: GRID_COLS - 5 };
