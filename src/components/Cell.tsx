import { memo } from 'react';
import type { CellType } from '../algorithms/types';

const CELL_CLASSES: Record<CellType, string> = {
  empty: 'bg-cell-empty',
  wall: 'bg-cell-wall',
  start: 'bg-cell-start',
  end: 'bg-cell-end',
};

interface CellProps {
  row: number;
  col: number;
  type: CellType;
}

/** One grid square. Memoized: re-renders only when its own type changes. */
export const Cell = memo(function Cell({ row, col, type }: CellProps) {
  return (
    <div
      data-row={row}
      data-col={col}
      data-type={type}
      className={`aspect-square transition-colors duration-100 ${CELL_CLASSES[type]}`}
    />
  );
});
