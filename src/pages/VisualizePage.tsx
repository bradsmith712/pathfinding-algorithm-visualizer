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
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { GRID_COLS, GRID_ROWS } from '../lib/constants';
import { createGridState, gridReducer, hasWalls, type DrawTool, type Tool } from '../lib/gridState';
import { runAlgorithm, visitedSoFar, type Speed } from '../lib/playback';

// Fit the grid to the viewport height on wide screens (header + padding ≈ 8rem).
const GRID_SIZE_STYLE = { maxWidth: `calc((100dvh - 8rem) * ${GRID_COLS} / ${GRID_ROWS})` };

const GRID_LABEL = `Pathfinding grid, ${GRID_COLS} columns by ${GRID_ROWS} rows`;

export function VisualizePage() {
  const [grid, dispatch] = useReducer(gridReducer, undefined, () => createGridState());
  const [tool, setTool] = useState<Tool>('select');
  const [algorithmId, setAlgorithmId] = useState<AlgorithmId>(DEFAULT_ALGORITHM_ID);
  const [speed, setSpeed] = useState<Speed>('normal');
  const reducedMotion = usePrefersReducedMotion();
  const animation = useAnimation(speed, reducedMotion);
  const { status, run } = animation.state;
  const { reset } = animation;

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
  const canClearWalls = useMemo(() => hasWalls(grid), [grid]);

  const start = () => {
    const result = runAlgorithm(getAlgorithm(algorithmId).run, {
      grid: grid.cells,
      start: grid.start,
      end: grid.end,
    });
    animation.play(result, GRID_ROWS, GRID_COLS);
  };

  const changeAlgorithm = (id: AlgorithmId) => {
    setAlgorithmId(id);
    reset();
  };

  return (
    <div className="mx-auto grid max-w-[1600px] gap-5 p-4 md:px-6 lg:grid-cols-[18rem_minmax(0,1fr)_18rem]">
      <aside aria-label="Controls" className="order-2 flex flex-col gap-4 lg:order-1">
        <ToolPanel
          tool={tool}
          onToolChange={setTool}
          onClearWalls={() => dispatch({ type: 'clearWalls' })}
          canClearWalls={canClearWalls}
          disabled={locked}
        />
        <AlgorithmSelect value={algorithmId} onChange={changeAlgorithm} disabled={locked} />
        <Controls
          status={status}
          onStart={start}
          onPause={animation.pause}
          onResume={animation.resume}
          onReset={reset}
          speed={speed}
          onSpeedChange={setSpeed}
          reducedMotion={reducedMotion}
        />
      </aside>

      <section aria-label="Grid" className="order-1 min-w-0 lg:order-2">
        <Grid
          cells={grid.cells}
          overlay={animation.state.overlay}
          current={animation.state.current}
          label={GRID_LABEL}
          drawing={drawing}
          className="mx-auto w-full"
          style={GRID_SIZE_STYLE}
        />
      </section>

      <aside aria-label="Results" className="order-3 flex flex-col gap-4">
        <Legend />
        <Stats status={status} run={run} visitedShown={visitedSoFar(animation.state)} />
        <InfoCard />
      </aside>
    </div>
  );
}
