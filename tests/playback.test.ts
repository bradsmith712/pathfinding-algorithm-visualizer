import { describe, expect, it } from 'vitest';
import { astar } from '../src/algorithms/astar';
import { bfs } from '../src/algorithms/bfs';
import { formatDuration } from '../src/lib/format';
import {
  INITIAL_PLAYBACK,
  playbackReducer,
  runAlgorithm,
  visitedSoFar,
  type PlaybackState,
  type RunResult,
} from '../src/lib/playback';
import { parseGrid } from './helpers';

const input = parseGrid(['S...', '.##.', '...E']);

function loaded(run: RunResult = runAlgorithm(bfs, input)): PlaybackState {
  return playbackReducer(INITIAL_PLAYBACK, { type: 'load', run, rows: 3, cols: 4 });
}

describe('runAlgorithm', () => {
  it('orders visit frames before path frames and drops start/end from the path', () => {
    const run = runAlgorithm(astar, input);
    expect(run.found).toBe(true);
    expect(run.pathLength).toBe(5);
    expect(run.visitFrameCount).toBe(run.visited);
    const kinds = run.frames.map((f) => f.kind);
    expect(kinds.slice(0, run.visitFrameCount).every((k) => k === 'visit')).toBe(true);
    expect(kinds.slice(run.visitFrameCount)).toEqual(['path', 'path', 'path', 'path']);
  });

  it('measures only the computation with the supplied clock', () => {
    let t = 100;
    const run = runAlgorithm(bfs, input, () => (t += 7));
    expect(run.durationMs).toBe(7);
  });

  it('reports no path with visit frames only', () => {
    const run = runAlgorithm(bfs, parseGrid(['S#E']));
    expect(run.found).toBe(false);
    expect(run.frames).toEqual([{ kind: 'visit', node: { row: 0, col: 0 } }]);
  });
});

describe('playbackReducer', () => {
  it('starts running with an empty overlay', () => {
    const state = loaded();
    expect(state.status).toBe('running');
    expect(state.cursor).toBe(0);
    expect(state.overlay!.flat().every((c) => c === null)).toBe(true);
  });

  it('applies frames and tracks the current node', () => {
    let state = loaded();
    state = playbackReducer(state, { type: 'advance', count: 2 });
    expect(state.cursor).toBe(2);
    expect(state.overlay![0]![0]).toBe('visited');
    expect(state.current).toEqual(state.run!.frames[1]!.node);
    expect(visitedSoFar(state)).toBe(2);
  });

  it('finishes when all frames are applied and clears the current node', () => {
    const state = playbackReducer(loaded(), { type: 'advance', count: Infinity });
    expect(state.status).toBe('finished');
    expect(state.current).toBeNull();
    expect(state.overlay!.flat().filter((c) => c === 'path')).toHaveLength(4);
    expect(visitedSoFar(state)).toBe(state.run!.visited);
  });

  it('pauses, steps while paused, and resumes', () => {
    let state = playbackReducer(loaded(), { type: 'pause' });
    expect(state.status).toBe('paused');
    state = playbackReducer(state, { type: 'advance', count: 1 });
    expect(state.cursor).toBe(1);
    expect(state.status).toBe('paused');
    state = playbackReducer(state, { type: 'resume' });
    expect(state.status).toBe('running');
  });

  it('ignores invalid transitions', () => {
    expect(playbackReducer(INITIAL_PLAYBACK, { type: 'pause' })).toBe(INITIAL_PLAYBACK);
    expect(playbackReducer(INITIAL_PLAYBACK, { type: 'resume' })).toBe(INITIAL_PLAYBACK);
    expect(playbackReducer(INITIAL_PLAYBACK, { type: 'advance', count: 3 })).toBe(INITIAL_PLAYBACK);
    expect(playbackReducer(INITIAL_PLAYBACK, { type: 'reset' })).toBe(INITIAL_PLAYBACK);
    const finished = playbackReducer(loaded(), { type: 'advance', count: Infinity });
    expect(playbackReducer(finished, { type: 'advance', count: 1 })).toBe(finished);
    expect(playbackReducer(finished, { type: 'pause' })).toBe(finished);
  });

  it('resets to idle from any state', () => {
    const state = playbackReducer(loaded(), { type: 'advance', count: 3 });
    expect(playbackReducer(state, { type: 'reset' })).toEqual(INITIAL_PLAYBACK);
  });

  it('finishes immediately when there is nothing to animate', () => {
    const run: RunResult = {
      frames: [],
      visitFrameCount: 0,
      found: false,
      visited: 0,
      pathLength: 0,
      durationMs: 0,
    };
    expect(loaded(run).status).toBe('finished');
  });

  it('only copies overlay rows that change', () => {
    const before = loaded();
    const after = playbackReducer(before, { type: 'advance', count: 1 });
    expect(after.overlay![0]).not.toBe(before.overlay![0]);
    expect(after.overlay![2]).toBe(before.overlay![2]);
  });
});

describe('formatDuration', () => {
  it('shows one decimal under 10 ms and whole numbers above', () => {
    expect(formatDuration(0.34)).toBe('0.3 ms');
    expect(formatDuration(2)).toBe('2.0 ms');
    expect(formatDuration(12.6)).toBe('13 ms');
  });
});
