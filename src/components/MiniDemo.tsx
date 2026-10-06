import { useMemo, useState } from 'react';
import { getAlgorithm } from '../algorithms';
import type { AlgorithmId } from '../algorithms/types';
import { ALGORITHM_INFO } from '../data/algorithms';
import { DEMO_MAZE } from '../data/demoMaze';
import { useAnimation } from '../hooks/useAnimation';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { DEMO_FRAME_RATE, demoPhase, runAlgorithm, type DemoPhase } from '../lib/playback';
import { DemoLegend } from './DemoLegend';
import { Grid } from './Grid';
import { Icon } from './Icon';
import { StepExplanation } from './StepExplanation';
import { StepTabs } from './StepTabs';

const ROWS = DEMO_MAZE.grid.length;
const COLS = DEMO_MAZE.grid[0]?.length ?? 0;

const SECONDARY_BUTTON =
  'flex h-10 items-center gap-2 rounded-control border border-border bg-surface-raised px-4 text-sm font-medium transition-colors hover:border-muted/50 disabled:cursor-not-allowed disabled:opacity-50';

interface MiniDemoProps {
  id: AlgorithmId;
}

/**
 * "How <Algorithm> Works": the real algorithm on the preset 14 × 8 maze, drawn
 * with the same Grid as the Visualize page. Each Step press is one phase of
 * the search: a node is explored (Explore), its neighbors are queued
 * (Prioritize), and finally the path is traced (Find Path).
 */
export function MiniDemo({ id }: MiniDemoProps) {
  const { shortName, run: algorithm } = getAlgorithm(id);
  const { steps } = ALGORITHM_INFO[id];
  const reducedMotion = usePrefersReducedMotion();
  const animation = useAnimation(reducedMotion ? 'instant' : DEMO_FRAME_RATE);
  const { state } = animation;
  const run = useMemo(() => runAlgorithm(algorithm, DEMO_MAZE, { frontier: true }), [algorithm]);

  // A clicked tab stays shown until the demo moves on (or starts/stops).
  const [pinned, setPinned] = useState<{ tab: DemoPhase; cursor: number; status: string } | null>(
    null,
  );
  const phase = demoPhase(state);
  const shownTab =
    pinned && pinned.cursor === state.cursor && pinned.status === state.status ? pinned.tab : phase;

  const playing = state.status === 'running';
  const onPlay = () => {
    if (playing) animation.pause();
    else if (state.status === 'paused') animation.resume();
    else animation.play(run, ROWS, COLS);
  };
  const onStep = () => {
    if (state.status === 'idle') animation.load(run, ROWS, COLS);
    if (playing) animation.pause();
    animation.step();
  };

  return (
    <section
      aria-labelledby="demo-heading"
      className="rounded-card border border-border bg-surface p-5"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="demo-heading" className="text-lg font-semibold">
          How {shortName} Works
        </h2>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onPlay}
            className="flex h-10 items-center gap-2 rounded-control bg-accent-solid px-4 text-sm font-semibold text-accent-fg transition hover:brightness-90"
          >
            <Icon name={playing ? 'pause' : 'play'} className="h-4 w-4" />
            {playing ? 'Pause' : 'Play'}
          </button>
          <button
            type="button"
            onClick={onStep}
            disabled={state.status === 'finished'}
            className={SECONDARY_BUTTON}
          >
            <Icon name="step" className="h-4 w-4" />
            Step
          </button>
          <button
            type="button"
            onClick={animation.reset}
            disabled={state.status === 'idle'}
            className={SECONDARY_BUTTON}
          >
            <Icon name="reset" className="h-4 w-4" />
            Reset
          </button>
        </div>
      </div>

      <div className="mt-4">
        <StepTabs
          titles={steps.map((s) => s.title)}
          active={shownTab}
          onSelect={(tab) => setPinned({ tab, cursor: state.cursor, status: state.status })}
        />
      </div>

      <div className="mt-5 grid gap-6 md:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)]">
        <div>
          <Grid
            cells={DEMO_MAZE.grid}
            overlay={state.overlay}
            current={state.current}
            currentStyle="outline"
            label={`Demo maze, ${COLS} columns by ${ROWS} rows. ${state.visitedShown} nodes visited${
              state.status === 'finished' ? ', path found' : ''
            }.`}
          />
          <DemoLegend />
        </div>
        <StepExplanation step={steps[shownTab]} index={shownTab} />
      </div>
    </section>
  );
}
