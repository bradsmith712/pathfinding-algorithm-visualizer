import { memo } from 'react';
import type { CSSProperties } from 'react';
import { SPEEDS, type PlaybackStatus, type Speed } from '../lib/playback';
import { Card } from './Card';
import { Icon } from './Icon';

interface ControlsProps {
  status: PlaybackStatus;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onReset: () => void;
  speed: Speed;
  onSpeedChange: (speed: Speed) => void;
  /** When the user prefers reduced motion, playback is always instant. */
  reducedMotion: boolean;
}

const SECONDARY_BUTTON =
  'flex h-11 items-center justify-center gap-2 rounded-control border border-border bg-surface-raised text-sm font-medium text-fg transition-colors hover:border-muted/50 disabled:cursor-not-allowed disabled:opacity-50';

/** Memoized: skips re-rendering on animation frames when its props are unchanged. */
export const Controls = memo(function Controls({
  status,
  onStart,
  onPause,
  onResume,
  onReset,
  speed,
  onSpeedChange,
  reducedMotion,
}: ControlsProps) {
  const active = status === 'running' || status === 'paused';
  const speedIndex = SPEEDS.findIndex((s) => s.id === speed);
  const speedLabel = SPEEDS[speedIndex]?.label ?? '';
  const fill = { '--range-fill': `${(speedIndex / (SPEEDS.length - 1)) * 100}%` } as CSSProperties;

  return (
    <Card step={3} title="Controls">
      <button
        type="button"
        onClick={onStart}
        disabled={active}
        className="flex h-11 w-full items-center justify-center gap-2 rounded-control bg-accent-solid text-sm font-semibold text-accent-fg transition hover:brightness-90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Icon name="play" className="h-4 w-4" />
        Start
      </button>

      <div className="mt-3 grid grid-cols-2 gap-3">
        {status === 'paused' ? (
          <button type="button" onClick={onResume} className={SECONDARY_BUTTON}>
            <Icon name="play" className="h-4 w-4" />
            Resume
          </button>
        ) : (
          <button
            type="button"
            onClick={onPause}
            disabled={status !== 'running'}
            className={SECONDARY_BUTTON}
          >
            <Icon name="pause" className="h-4 w-4" />
            Pause
          </button>
        )}
        <button
          type="button"
          onClick={onReset}
          disabled={status === 'idle'}
          className={SECONDARY_BUTTON}
        >
          <Icon name="reset" className="h-4 w-4" />
          Reset
        </button>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm">
        <label htmlFor="speed-slider">Speed</label>
        <span className="text-muted">
          {reducedMotion ? 'Instant (reduced motion)' : speedLabel}
        </span>
      </div>
      <input
        id="speed-slider"
        type="range"
        min={0}
        max={SPEEDS.length - 1}
        step={1}
        value={speedIndex}
        disabled={reducedMotion}
        aria-valuetext={speedLabel}
        onChange={(e) => {
          const next = SPEEDS[Number(e.target.value)];
          if (next) onSpeedChange(next.id);
        }}
        className="range mt-2"
        style={fill}
      />
    </Card>
  );
});
