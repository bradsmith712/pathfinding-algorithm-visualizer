import type { CSSProperties } from 'react';
import type { CellType } from '../algorithms/types';
import type { GridDrawingHandlers } from '../hooks/useGridDrawing';
import { Cell } from './Cell';

interface GridProps {
  cells: CellType[][];
  /** Accessible name describing the grid. */
  label: string;
  /** Pointer handlers from useGridDrawing; omit for a read-only grid. */
  drawing?: GridDrawingHandlers;
  className?: string;
  style?: CSSProperties;
}

/**
 * Square-celled grid with thin grid lines (the 1px gaps show the line color
 * behind the cells) and a rounded outer border. Shared by Visualize and Learn.
 */
export function Grid({ cells, label, drawing, className = '', style }: GridProps) {
  const rows = cells.length;
  const cols = cells[0]?.length ?? 0;

  return (
    <div
      role="img"
      aria-label={label}
      onPointerDown={drawing?.onPointerDown}
      onPointerMove={drawing?.onPointerMove}
      className={`grid select-none gap-px overflow-hidden rounded-card border border-border bg-cell-line p-px ${
        drawing?.capturesTouch ? 'cursor-crosshair touch-none' : ''
      } ${className}`}
      style={{
        gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
        aspectRatio: `${cols} / ${rows}`,
        ...style,
      }}
    >
      {cells.map((row, r) =>
        row.map((type, c) => <Cell key={`${r}-${c}`} row={r} col={c} type={type} />),
      )}
    </div>
  );
}
