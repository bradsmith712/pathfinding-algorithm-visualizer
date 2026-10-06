import { useCallback, useState } from 'react';
import type { FocusEvent, KeyboardEvent } from 'react';
import type { OverlayType, Pos } from '../algorithms/types';
import { describeCell } from '../lib/describeCell';
import { gridReducer, type DrawTool, type GridState, type Tool } from '../lib/gridState';

interface UseGridKeyboardOptions {
  grid: GridState;
  overlay: (OverlayType | null)[][] | null;
  tool: Tool;
  /** True while an animation is running or paused. */
  disabled: boolean;
  onPaint: (tool: DrawTool, positions: Pos[]) => void;
}

export interface GridKeyboard {
  /** Keyboard cursor, shown only while the grid has keyboard focus. */
  cursor: Pos | null;
  /** Latest message for the grid's screen reader live region. */
  announcement: string;
  onKeyDown: (e: KeyboardEvent<HTMLElement>) => void;
  onFocus: (e: FocusEvent<HTMLElement>) => void;
  onBlur: () => void;
}

const MOVES: Record<string, Pos> = {
  ArrowUp: { row: -1, col: 0 },
  ArrowDown: { row: 1, col: 0 },
  ArrowLeft: { row: 0, col: -1 },
  ArrowRight: { row: 0, col: 1 },
};

const where = (p: Pos) => `Row ${p.row + 1}, column ${p.col + 1}`;

/**
 * Keyboard drawing for the Visualize grid: arrow keys move a cursor, Space or
 * Enter applies the selected tool, Shift + arrow paints while moving (Wall and
 * Erase), Home/End jump to the ends of the row. Every move and edit is
 * announced for screen readers.
 */
export function useGridKeyboard({
  grid,
  overlay,
  tool,
  disabled,
  onPaint,
}: UseGridKeyboardOptions): GridKeyboard {
  const [cursor, setCursor] = useState<Pos | null>(null);
  // Remembered so returning to the grid puts the cursor back where it was.
  const [lastCursor, setLastCursor] = useState<Pos>(grid.start);
  const [announcement, setAnnouncement] = useState('');

  const rows = grid.cells.length;
  const cols = grid.cells[0]?.length ?? 0;

  const describe = useCallback(
    (state: GridState, p: Pos) =>
      `${where(p)}: ${describeCell(state.cells[p.row]?.[p.col] ?? 'empty', overlay?.[p.row]?.[p.col] ?? null)}`,
    [overlay],
  );

  /** Applies the tool at `p` and returns the announcement for the result. */
  const apply = useCallback(
    (p: Pos): string => {
      if (disabled) return 'Drawing is locked while the search is running. Press Reset to edit.';
      if (tool === 'select')
        return 'Choose Wall, Start, End or Erase in Drawing Tools to edit the grid.';
      const next = gridReducer(grid, { type: 'paint', tool, positions: [p] });
      onPaint(tool, [p]);
      if (next === grid) {
        if (tool === 'wall' || tool === 'erase') return describe(grid, p);
        return `Can't place the ${tool} here. ${describe(grid, p)}`;
      }
      return describe(next, p);
    },
    [disabled, tool, grid, onPaint, describe],
  );

  const onKeyDown = useCallback(
    (e: KeyboardEvent<HTMLElement>) => {
      if (!cursor) return;
      let next: Pos | undefined;
      const move = MOVES[e.key];
      if (move) {
        next = {
          row: Math.min(rows - 1, Math.max(0, cursor.row + move.row)),
          col: Math.min(cols - 1, Math.max(0, cursor.col + move.col)),
        };
      } else if (e.key === 'Home') {
        next = { row: cursor.row, col: 0 };
      } else if (e.key === 'End') {
        next = { row: cursor.row, col: cols - 1 };
      } else if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        setAnnouncement(apply(cursor));
        return;
      } else {
        return;
      }

      e.preventDefault();
      setCursor(next);
      setLastCursor(next);
      const paints = e.shiftKey && move && (tool === 'wall' || tool === 'erase');
      setAnnouncement(paints ? apply(next) : describe(grid, next));
    },
    [cursor, rows, cols, tool, grid, apply, describe],
  );

  const onFocus = useCallback(
    (e: FocusEvent<HTMLElement>) => {
      // Only show the cursor for keyboard focus, not when a click focuses the grid.
      if (e.target !== e.currentTarget || !e.currentTarget.matches(':focus-visible')) return;
      setCursor(lastCursor);
      setAnnouncement(describe(grid, lastCursor));
    },
    [lastCursor, grid, describe],
  );

  const onBlur = useCallback(() => setCursor(null), []);

  return { cursor, announcement, onKeyDown, onFocus, onBlur };
}
