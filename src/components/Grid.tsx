import type { CSSProperties } from 'react';
import type { CellType, Pos } from '../algorithms/types';
import type { GridDrawingHandlers } from '../hooks/useGridDrawing';
import type { Overlay } from '../lib/playback';
import { Cell } from './Cell';

interface GridProps {
  cells: CellType[][];
  /** Visited/path overlay from the animation, same size as `cells`. */
  overlay?: Overlay | null;
  /** Most recently visited node, highlighted while animating. */
  current?: Pos | null;
  /** Accessible name describing the grid. */
  label: string;
  /** Pointer handlers from useGridDrawing; omit for a read-only grid. */
  drawing?: GridDrawingHandlers;
  className?: string;
  style?: CSSProperties;
}

/**
 * Square-celled grid with thin grid lines and a rounded outer border. Shared
 * by Visualize and Learn. Lines are per-cell right/bottom borders (browsers
 * snap borders to whole pixels, unlike 1px grid gaps at fractional sizes); the
 * inner grid is 1px wider and taller than the frame so the outermost
 * right/bottom borders are clipped and don't double up with the frame.
 */
export function Grid({
  cells,
  overlay,
  current,
  label,
  drawing,
  className = '',
  style,
}: GridProps) {
  const cols = cells[0]?.length ?? 0;

  return (
    <div
      role="img"
      aria-label={label}
      onPointerDown={drawing?.onPointerDown}
      onPointerMove={drawing?.onPointerMove}
      className={`select-none overflow-hidden rounded-[10px] border border-border bg-cell-empty ${
        drawing?.capturesTouch ? 'cursor-crosshair touch-none' : ''
      } ${className}`}
      style={style}
    >
      <div
        className="-mb-px grid w-[calc(100%+1px)]"
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
      >
        {cells.map((row, r) =>
          row.map((type, c) => (
            <Cell
              key={`${r}-${c}`}
              row={r}
              col={c}
              type={type}
              overlay={overlay?.[r]?.[c] ?? null}
              isCurrent={current?.row === r && current.col === c}
            />
          )),
        )}
      </div>
    </div>
  );
}
