import { memo } from 'react';
import type { CellType, OverlayType } from '../algorithms/types';

const BASE_CLASSES: Record<Exclude<CellType, 'empty'>, string> = {
  wall: 'bg-cell-wall',
  start: 'bg-cell-start',
  end: 'bg-cell-end',
};

const OVERLAY_CLASSES: Record<OverlayType, string> = {
  visited: 'bg-cell-visited motion-safe:animate-cell-visit',
  path: 'path-cell motion-safe:animate-cell-path',
};

interface CellProps {
  row: number;
  col: number;
  type: CellType;
  overlay: OverlayType | null;
  /**
   * How to mark the most recently visited node, or null if this isn't it:
   * 'fill' (Visualize: darker blue) or 'outline' (Learn demo: yellow outline).
   */
  current: 'fill' | 'outline' | null;
}

function cellClass(
  type: CellType,
  overlay: OverlayType | null,
  current: CellProps['current'],
): string {
  // Walls, start and end always win over overlays.
  if (type !== 'empty') return BASE_CLASSES[type];
  if (current === 'fill') return 'bg-cell-visited-recent';
  if (current === 'outline') return 'bg-cell-visited-recent ring-2 ring-inset ring-cell-current';
  return overlay ? OVERLAY_CLASSES[overlay] : 'bg-cell-empty';
}

/** One grid square. Memoized: re-renders only when its own props change. */
export const Cell = memo(function Cell({ row, col, type, overlay, current }: CellProps) {
  return (
    <div
      data-row={row}
      data-col={col}
      data-type={type}
      data-overlay={overlay ?? undefined}
      className={`aspect-square border-b border-r border-cell-line ${cellClass(type, overlay, current)}`}
    />
  );
});
