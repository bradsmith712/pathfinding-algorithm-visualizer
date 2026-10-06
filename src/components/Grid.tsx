import { useId, type CSSProperties } from 'react';
import type { CellType, Pos } from '../algorithms/types';
import type { GridDrawingHandlers } from '../hooks/useGridDrawing';
import type { GridKeyboard } from '../hooks/useGridKeyboard';
import type { Overlay } from '../lib/playback';
import { GridRow } from './GridRow';

interface GridProps {
  cells: CellType[][];
  /** Visited/path overlay from the animation, same size as `cells`. */
  overlay?: Overlay | null;
  /** Most recently visited node, highlighted while animating. */
  current?: Pos | null;
  /** 'fill' (darker blue, Visualize) or 'outline' (yellow outline, Learn demo). */
  currentStyle?: 'fill' | 'outline';
  /** Accessible name describing the grid. */
  label: string;
  /** Pointer handlers from useGridDrawing; omit for a read-only grid. */
  drawing?: GridDrawingHandlers;
  /** Keyboard drawing from useGridKeyboard; makes the grid focusable. */
  keyboard?: GridKeyboard;
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
  currentStyle = 'fill',
  label,
  drawing,
  keyboard,
  className = '',
  style,
}: GridProps) {
  const cols = cells[0]?.length ?? 0;
  const helpId = useId();
  const cursor = keyboard?.cursor;

  return (
    <div
      {...(keyboard
        ? {
            role: 'application',
            'aria-roledescription': 'grid editor',
            tabIndex: 0,
            'aria-describedby': helpId,
            onKeyDown: keyboard.onKeyDown,
            onFocus: keyboard.onFocus,
            onBlur: keyboard.onBlur,
          }
        : { role: 'img' })}
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
        {cells.map((row, r) => (
          <GridRow
            key={r}
            row={r}
            cells={row}
            overlay={overlay?.[r]}
            currentCol={current?.row === r ? current.col : -1}
            currentStyle={currentStyle}
            cursorCol={cursor?.row === r ? cursor.col : -1}
          />
        ))}
      </div>
      {keyboard && (
        <>
          <p id={helpId} className="sr-only">
            Use the arrow keys to move. Press Space or Enter to apply the selected drawing tool.
            Hold Shift with the arrow keys to draw walls or erase while moving.
          </p>
          <div aria-live="polite" className="sr-only">
            {keyboard.announcement}
          </div>
        </>
      )}
    </div>
  );
}
