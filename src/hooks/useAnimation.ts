import { useCallback, useEffect, useLayoutEffect, useReducer, useRef } from 'react';
import {
  FRAME_RATES,
  INITIAL_PLAYBACK,
  playbackReducer,
  type PlaybackState,
  type RunResult,
  type Speed,
} from '../lib/playback';

export interface AnimationControls {
  state: PlaybackState;
  /** Load a finished search and start playing it (instantly when `instant`). */
  play: (run: RunResult, rows: number, cols: number) => void;
  pause: () => void;
  resume: () => void;
  /** Advance one frame while paused. */
  step: () => void;
  reset: () => void;
}

/**
 * Plays back a precomputed search at the chosen speed using requestAnimationFrame.
 * Several frames are applied per animation frame at high speeds, so the grid
 * re-renders at most once per display frame. `instant` skips straight to the end.
 */
export function useAnimation(speed: Speed, instant: boolean): AnimationControls {
  const [state, dispatch] = useReducer(playbackReducer, INITIAL_PLAYBACK);
  const stateRef = useRef(state);
  useLayoutEffect(() => {
    stateRef.current = state;
  });

  const { status } = state;

  useEffect(() => {
    if (status !== 'running') return;
    // Switching to Instant (or reduced motion) mid-run jumps to the end.
    if (speed === 'instant' || instant) {
      dispatch({ type: 'advance', count: Infinity });
      return;
    }

    const rates = FRAME_RATES[speed];
    let last = performance.now();
    let budget = 0;
    let handle = 0;

    const tick = (now: number) => {
      const { run, cursor } = stateRef.current;
      if (!run) return;
      const inVisits = cursor < run.visitFrameCount;
      budget += ((now - last) / 1000) * (inVisits ? rates.visit : rates.path);
      last = now;

      let count = Math.floor(budget);
      if (count > 0) {
        budget -= count;
        if (inVisits && cursor + count >= run.visitFrameCount) {
          // Don't let a burst of visit frames spill into the slower path phase.
          count = run.visitFrameCount - cursor;
          budget = 0;
        }
        dispatch({ type: 'advance', count });
      }
      handle = requestAnimationFrame(tick);
    };

    handle = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(handle);
  }, [status, speed, instant]);

  const skipAnimation = instant || speed === 'instant';
  const play = useCallback(
    (run: RunResult, rows: number, cols: number) => {
      dispatch({ type: 'load', run, rows, cols });
      // Batched with the load, so the empty overlay never paints.
      if (skipAnimation) dispatch({ type: 'advance', count: Infinity });
    },
    [skipAnimation],
  );
  const pause = useCallback(() => dispatch({ type: 'pause' }), []);
  const resume = useCallback(() => dispatch({ type: 'resume' }), []);
  const step = useCallback(() => dispatch({ type: 'advance', count: 1 }), []);
  const reset = useCallback(() => dispatch({ type: 'reset' }), []);

  return { state, play, pause, resume, step, reset };
}
