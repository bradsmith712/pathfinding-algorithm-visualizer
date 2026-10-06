import type { PlaybackStatus, RunResult } from '../lib/playback';
import { formatDuration } from '../lib/format';
import { Card } from './Card';

interface StatsProps {
  status: PlaybackStatus;
  run: RunResult | null;
  /** Visited nodes shown so far; counts up while animating. */
  visitedShown: number;
}

const EMPTY = '—';

export function Stats({ status, run, visitedShown }: StatsProps) {
  const finished = status === 'finished' && run !== null;
  const noPath = finished && !run.found;

  const rows: { label: string; value: string }[] = [
    { label: 'Nodes Visited', value: run ? String(visitedShown) : EMPTY },
    {
      label: 'Path Length',
      value: !finished ? EMPTY : run.found ? String(run.pathLength) : 'No path',
    },
    { label: 'Execution Time', value: run ? formatDuration(run.durationMs) : EMPTY },
  ];

  return (
    <Card icon="chart" title="Statistics">
      <dl className="flex flex-col gap-3 text-sm">
        {rows.map(({ label, value }) => (
          <div key={label} className="flex items-center justify-between gap-2">
            <dt className="text-fg/85">{label}</dt>
            <dd
              className={`font-semibold tabular-nums ${value === 'No path' ? 'text-tone-red' : ''}`}
            >
              {value}
            </dd>
          </div>
        ))}
      </dl>
      <div role="status" aria-live="polite">
        {noPath && (
          <p className="mt-3 rounded-control border border-tone-red/40 bg-tone-red/10 px-3 py-2 text-sm font-medium text-tone-red">
            No path found. The end can't be reached from the start.
          </p>
        )}
      </div>
    </Card>
  );
}
