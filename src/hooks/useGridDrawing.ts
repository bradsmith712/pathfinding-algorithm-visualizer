import { useCallback, useEffect, useRef } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import type { Pos } from '../algorithms/types';
import type { DrawTool, Tool } from '../lib/gridState';
import { lineBetween } from '../lib/line';
import { samePos } from '../lib/grid';

interface UseGridDrawingOptions {
  tool: Tool;
  /** True while an animation is running or paused. */
  disabled: boolean;
  onPaint: (tool: DrawTool, positions: Pos[]) => void;
}

export interface GridDrawingHandlers {
  onPointerDown: (e: ReactPointerEvent<HTMLElement>) => void;
  onPointerMove: (e: ReactPointerEvent<HTMLElement>) => void;
  /** Whether the grid should swallow touch gestures (so dragging draws instead of scrolling). */
  capturesTouch: boolean;
}

/** Finds the grid cell under a screen point, if it belongs to `container`. */
function cellAt(container: HTMLElement, x: number, y: number): Pos | undefined {
  const el = document.elementFromPoint(x, y)?.closest<HTMLElement>('[data-row][data-col]');
  if (!el || !container.contains(el)) return undefined;
  return { row: Number(el.dataset.row), col: Number(el.dataset.col) };
}

/**
 * Pointer-based click-and-drag drawing for the Grid. Handlers go on the grid
 * container (event delegation), so cells stay plain and cheap to render.
 * Works for mouse, pen and touch; dragging ends on pointer up anywhere.
 */
export function useGridDrawing({
  tool,
  disabled,
  onPaint,
}: UseGridDrawingOptions): GridDrawingHandlers {
  const drag = useRef<{ container: HTMLElement; last: Pos } | null>(null);
  const activeTool: DrawTool | undefined = tool === 'select' || disabled ? undefined : tool;

  useEffect(() => {
    const end = () => {
      drag.current = null;
    };
    window.addEventListener('pointerup', end);
    window.addEventListener('pointercancel', end);
    window.addEventListener('blur', end);
    return () => {
      window.removeEventListener('pointerup', end);
      window.removeEventListener('pointercancel', end);
      window.removeEventListener('blur', end);
    };
  }, []);

  // Locking the grid mid-drag (e.g. an animation starts) ends the drag.
  useEffect(() => {
    if (!activeTool) drag.current = null;
  }, [activeTool]);

  const onPointerDown = useCallback(
    (e: ReactPointerEvent<HTMLElement>) => {
      if (!activeTool || !e.isPrimary || e.button !== 0) return;
      const container = e.currentTarget;
      const pos = cellAt(container, e.clientX, e.clientY);
      if (!pos) return;
      e.preventDefault();
      // Keep receiving moves even if the pointer leaves the grid.
      container.setPointerCapture(e.pointerId);
      drag.current = { container, last: pos };
      onPaint(activeTool, [pos]);
    },
    [activeTool, onPaint],
  );

  const onPointerMove = useCallback(
    (e: ReactPointerEvent<HTMLElement>) => {
      const current = drag.current;
      if (!current || !activeTool || !e.isPrimary) return;
      const pos = cellAt(current.container, e.clientX, e.clientY);
      if (!pos || samePos(pos, current.last)) return;
      const positions =
        activeTool === 'start' || activeTool === 'end'
          ? [pos]
          : lineBetween(current.last, pos).slice(1);
      current.last = pos;
      onPaint(activeTool, positions);
    },
    [activeTool, onPaint],
  );

  return { onPointerDown, onPointerMove, capturesTouch: activeTool !== undefined };
}
