import { useCallback, useMemo, useReducer, useState } from 'react';
import type { Pos } from '../algorithms/types';
import { Card } from '../components/Card';
import { Grid } from '../components/Grid';
import { ToolPanel } from '../components/ToolPanel';
import { useGridDrawing } from '../hooks/useGridDrawing';
import { GRID_COLS, GRID_ROWS } from '../lib/constants';
import { createGridState, gridReducer, hasWalls, type DrawTool, type Tool } from '../lib/gridState';

// Fit the grid to the viewport height on wide screens (header + padding ≈ 8rem).
const GRID_SIZE_STYLE = { maxWidth: `calc((100dvh - 8rem) * ${GRID_COLS} / ${GRID_ROWS})` };

const GRID_LABEL = `Pathfinding grid, ${GRID_COLS} columns by ${GRID_ROWS} rows`;

export function VisualizePage() {
  const [grid, dispatch] = useReducer(gridReducer, undefined, () => createGridState());
  const [tool, setTool] = useState<Tool>('select');
  // Wired to the animation state in Phase 4.
  const locked = false;

  const onPaint = useCallback(
    (drawTool: DrawTool, positions: Pos[]) =>
      dispatch({ type: 'paint', tool: drawTool, positions }),
    [],
  );
  const drawing = useGridDrawing({ tool, disabled: locked, onPaint });
  const canClearWalls = useMemo(() => hasWalls(grid), [grid]);

  return (
    <div className="mx-auto grid max-w-[1600px] gap-4 p-4 lg:grid-cols-[17rem_minmax(0,1fr)_17rem]">
      <aside aria-label="Controls" className="order-2 flex flex-col gap-4 lg:order-1">
        <ToolPanel
          tool={tool}
          onToolChange={setTool}
          onClearWalls={() => dispatch({ type: 'clearWalls' })}
          canClearWalls={canClearWalls}
          disabled={locked}
        />
        <Card step={2} title="Choose Algorithm" description="Coming soon." />
        <Card step={3} title="Controls" description="Coming soon." />
      </aside>

      <section aria-label="Grid" className="order-1 min-w-0 lg:order-2">
        <Grid
          cells={grid.cells}
          label={GRID_LABEL}
          drawing={drawing}
          className="mx-auto w-full"
          style={GRID_SIZE_STYLE}
        />
      </section>

      <aside aria-label="Results" className="order-3 flex flex-col gap-4">
        <Card title="Legend" description="Coming soon." />
        <Card title="Statistics" description="Coming soon." />
      </aside>
    </div>
  );
}
