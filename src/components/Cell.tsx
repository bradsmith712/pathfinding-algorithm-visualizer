import { memo } from 'react';
import type { CellType, OverlayType } from '../algorithms/types';

const BASE_CLASSES: Record<Exclude<CellType, 'empty'>, string> = {
  wall: 'bg-cell-wall',
  start: 'bg-cell-start',
  end: 'bg-cell-end',
};

const OVERLAY_CLASSES: Record<OverlayType, string> = {
  visited: 'bg-cell-visited motion-safe:animate-cell-visit',
  path: 'bg-cell-path motion-safe:animate-cell-path',
};

interface CellProps {
  row: number;
  col: number;
  type: CellType;
  overlay: OverlayType | null;
  /** Most recently visited node: drawn a darker blue. */
  isCurrent: boolean;
}

function cellClass(type: CellType, overlay: OverlayType | null, isCurrent: boolean): string {
  // Walls, start and end always win over overlays.
  if (type !== 'empty') return BASE_CLASSES[type];
  if (isCurrent) return 'bg-cell-visited-recent';
  return overlay ? OVERLAY_CLASSES[overlay] : 'bg-cell-empty';
}

/** One grid square. Memoized: re-renders only when its own props change. */
export const Cell = memo(function Cell({ row, col, type, overlay, isCurrent }: CellProps) {
  return (
    <div
      data-row={row}
      data-col={col}
      data-type={type}
      data-overlay={overlay ?? undefined}
      className={`aspect-square border-b border-r border-cell-line ${cellClass(type, overlay, isCurrent)}`}
    />
  );
});
