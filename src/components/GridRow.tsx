import { memo } from 'react';
import type { CellType, OverlayType } from '../algorithms/types';
import { Cell } from './Cell';

interface GridRowProps {
  row: number;
  cells: CellType[];
  overlay: (OverlayType | null)[] | undefined;
  /** Column of the current (most recently visited) node in this row, or -1. */
  currentCol: number;
  currentStyle: 'fill' | 'outline';
  /** Column of the keyboard cursor in this row, or -1. */
  cursorCol: number;
}

/**
 * One row of cells. Memoized: the grid and overlay are updated copy-on-write
 * per row, so during animation only rows that actually changed re-render.
 * Rendered as a fragment so cells stay direct children of the CSS grid.
 */
export const GridRow = memo(function GridRow({
  row,
  cells,
  overlay,
  currentCol,
  currentStyle,
  cursorCol,
}: GridRowProps) {
  return (
    <>
      {cells.map((type, col) => (
        <Cell
          key={col}
          row={row}
          col={col}
          type={type}
          overlay={overlay?.[col] ?? null}
          current={col === currentCol ? currentStyle : null}
          isCursor={col === cursorCol}
        />
      ))}
    </>
  );
});
