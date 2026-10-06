import { useCallback, useEffect, useLayoutEffect, useReducer, useRef } from 'react';
import {
  INITIAL_PLAYBACK,
  playbackReducer,
  type FrameRate,
  type PlaybackState,
  type RunResult,
} from '../lib/playback';

export interface AnimationControls {
  state: PlaybackState;
  /** Load a finished search and start playing it (instantly when the rate is 'instant'). */
  play: (run: RunResult, rows: number, cols: number) => void;
  /** Load a finished search paused at the beginning, ready for `step`. */
  load: (run: RunResult, rows: number, cols: number) => void;
  pause: () => void;
  resume: () => void;
  /** Advance one frame (while paused). */
  step: () => void;
  reset: () => void;
}

/**
 * Plays back a precomputed search using requestAnimationFrame. Several frames
 * are applied per display frame at high rates, so the grid re-renders at most
 * once per display frame. `rate` must be a stable object (e.g. a constant);
 * 'instant' skips straight to the end.
 */
export function useAnimation(rate: FrameRate | 'instant'): AnimationControls {
  const [state, dispatch] = useReducer(playbackReducer, INITIAL_PLAYBACK);
  const stateRef = useRef(state);
  useLayoutEffect(() => {
    stateRef.current = state;
  });

  const { status } = state;

  useEffect(() => {
    if (status !== 'running') return;
    // Switching to Instant (or reduced motion) mid-run jumps to the end.
    if (rate === 'instant') {
      dispatch({ type: 'advance', count: Infinity });
      return;
    }

    let last = performance.now();
    let budget = 0;
    let handle = 0;

    const tick = (now: number) => {
      const { run, cursor } = stateRef.current;
      if (!run) return;
      const inSearch = cursor < run.pathStart;
      budget += ((now - last) / 1000) * (inSearch ? rate.search : rate.path);
      last = now;

      let count = Math.floor(budget);
      if (count > 0) {
        budget -= count;
        if (inSearch && cursor + count >= run.pathStart) {
          // Don't let a burst of search frames spill into the slower path phase.
          count = run.pathStart - cursor;
          budget = 0;
        }
        dispatch({ type: 'advance', count });
      }
      handle = requestAnimationFrame(tick);
    };

    handle = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(handle);
  }, [status, rate]);

  const instant = rate === 'instant';
  const play = useCallback(
    (run: RunResult, rows: number, cols: number) => {
      dispatch({ type: 'load', run, rows, cols });
      // Batched with the load, so the empty overlay never paints.
      if (instant) dispatch({ type: 'advance', count: Infinity });
    },
    [instant],
  );
  const load = useCallback(
    (run: RunResult, rows: number, cols: number) =>
      dispatch({ type: 'load', run, rows, cols, paused: true }),
    [],
  );
  const pause = useCallback(() => dispatch({ type: 'pause' }), []);
  const resume = useCallback(() => dispatch({ type: 'resume' }), []);
  const step = useCallback(() => dispatch({ type: 'advance', count: 1 }), []);
  const reset = useCallback(() => dispatch({ type: 'reset' }), []);

  return { state, play, load, pause, resume, step, reset };
}
