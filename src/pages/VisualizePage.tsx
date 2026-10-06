import { useCallback, useEffect, useMemo, useReducer, useState } from 'react';
import { DEFAULT_ALGORITHM_ID, getAlgorithm } from '../algorithms';
import type { AlgorithmId, Pos } from '../algorithms/types';
import { AlgorithmSelect } from '../components/AlgorithmSelect';
import { Controls } from '../components/Controls';
import { Grid } from '../components/Grid';
import { InfoCard } from '../components/InfoCard';
import { Legend } from '../components/Legend';
import { Stats } from '../components/Stats';
import { ToolPanel } from '../components/ToolPanel';
import { useAnimation } from '../hooks/useAnimation';
import { useGridDrawing } from '../hooks/useGridDrawing';
import { useGridKeyboard } from '../hooks/useGridKeyboard';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { GRID_COLS, GRID_ROWS } from '../lib/constants';
import { createGridState, gridReducer, hasWalls, type DrawTool, type Tool } from '../lib/gridState';
import { FRAME_RATES, runAlgorithm, type Speed } from '../lib/playback';

// Fit the grid to the viewport height on wide screens (header + padding ≈ 8rem).
const GRID_SIZE_STYLE = { maxWidth: `calc((100dvh - 8rem) * ${GRID_COLS} / ${GRID_ROWS})` };

const GRID_LABEL = `Pathfinding grid, ${GRID_COLS} columns by ${GRID_ROWS} rows`;

export function VisualizePage() {
  const [grid, dispatch] = useReducer(gridReducer, undefined, () => createGridState());
  const [tool, setTool] = useState<Tool>('select');
  const [algorithmId, setAlgorithmId] = useState<AlgorithmId>(DEFAULT_ALGORITHM_ID);
  const [speed, setSpeed] = useState<Speed>('normal');
  const reducedMotion = usePrefersReducedMotion();
  const animation = useAnimation(
    reducedMotion || speed === 'instant' ? 'instant' : FRAME_RATES[speed],
  );
  const { status, run, overlay, current, visitedShown } = animation.state;
  const { play, pause, resume, reset } = animation;

  // Drawing is locked while a run is in progress (running or paused).
  const locked = status === 'running' || status === 'paused';

  // Editing the maze after a finished run makes the overlay stale, so clear it.
  // (Edits are impossible while locked, so this only ever fires when finished.)
  useEffect(() => {
    reset();
  }, [grid, reset]);

  const onPaint = useCallback(
    (drawTool: DrawTool, positions: Pos[]) =>
      dispatch({ type: 'paint', tool: drawTool, positions }),
    [],
  );
  const drawing = useGridDrawing({ tool, disabled: locked, onPaint });
  const keyboard = useGridKeyboard({ grid, overlay, tool, disabled: locked, onPaint });
  const canClearWalls = useMemo(() => hasWalls(grid), [grid]);

  // Stable callbacks so the memoized side panels skip re-rendering on every
  // animation frame (only the grid rows that change and Stats need to).
  const clearWalls = useCallback(() => dispatch({ type: 'clearWalls' }), []);
  const start = useCallback(() => {
    const result = runAlgorithm(getAlgorithm(algorithmId).run, {
      grid: grid.cells,
      start: grid.start,
      end: grid.end,
    });
    play(result, GRID_ROWS, GRID_COLS);
  }, [algorithmId, grid, play]);
  const changeAlgorithm = useCallback(
    (id: AlgorithmId) => {
      setAlgorithmId(id);
      reset();
    },
    [reset],
  );

  // DOM order is Controls → Grid → Results (tab order: pick a tool, then draw);
  // CSS moves the grid first on narrow screens and into the middle on wide ones.
  return (
    <div className="mx-auto grid max-w-[1600px] gap-5 p-4 md:grid-cols-2 md:px-6 xl:px-4 lg:grid-cols-[18rem_minmax(0,1fr)] xl:grid-cols-[18rem_minmax(0,1fr)_18rem]">
      <aside aria-label="Controls" className="flex flex-col gap-4 lg:col-start-1 lg:row-start-1">
        <ToolPanel
          tool={tool}
          onToolChange={setTool}
          onClearWalls={clearWalls}
          canClearWalls={canClearWalls}
          disabled={locked}
        />
        <AlgorithmSelect value={algorithmId} onChange={changeAlgorithm} disabled={locked} />
        <Controls
          status={status}
          onStart={start}
          onPause={pause}
          onResume={resume}
          onReset={reset}
          speed={speed}
          onSpeedChange={setSpeed}
          reducedMotion={reducedMotion}
        />
      </aside>

      <section
        aria-label="Grid"
        className="order-first min-w-0 md:col-span-2 lg:sticky lg:top-4 lg:order-none lg:col-span-1 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-start xl:row-span-1"
      >
        <Grid
          cells={grid.cells}
          overlay={overlay}
          current={current}
          label={GRID_LABEL}
          drawing={drawing}
          keyboard={keyboard}
          className="mx-auto w-full"
          style={GRID_SIZE_STYLE}
        />
        {keyboard.cursor && (
          <p className="mx-auto mt-2 text-center text-xs text-muted">
            <kbd className="font-sans font-semibold text-fg">Arrows</kbd> move ·{' '}
            <kbd className="font-sans font-semibold text-fg">Space</kbd> apply tool ·{' '}
            <kbd className="font-sans font-semibold text-fg">Shift + Arrows</kbd> draw while moving
          </p>
        )}
      </section>

      <aside
        aria-label="Results"
        className="flex flex-col gap-4 lg:col-start-1 lg:row-start-2 xl:col-start-3 xl:row-start-1"
      >
        <Legend />
        <Stats status={status} run={run} visitedShown={visitedShown} />
        <InfoCard />
      </aside>
    </div>
  );
}
