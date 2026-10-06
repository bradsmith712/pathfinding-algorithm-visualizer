import type { Algorithm, AlgorithmInput, OverlayType, Pos } from '../algorithms/types';
import { gridWriter, samePos } from './grid';

/** One visible animation step. */
export type Frame = { kind: 'visit'; node: Pos } | { kind: 'path'; node: Pos };

export interface RunResult {
  /** All visit frames, then the path frames (start and end excluded: they're always drawn on top). */
  frames: Frame[];
  visitFrameCount: number;
  found: boolean;
  visited: number;
  pathLength: number;
  /** Time spent computing the search, excluding any animation. */
  durationMs: number;
}

/**
 * Runs the algorithm to completion, timing only the computation, and turns
 * its step events into animation frames.
 */
export function runAlgorithm(
  algorithm: Algorithm,
  input: AlgorithmInput,
  now: () => number = () => performance.now(),
): RunResult {
  const t0 = now();
  const events = [...algorithm(input)];
  const durationMs = now() - t0;

  const visits: Frame[] = [];
  const path: Frame[] = [];
  let found = false;
  let visited = 0;
  let pathLength = 0;
  for (const event of events) {
    switch (event.type) {
      case 'visit':
        visits.push({ kind: 'visit', node: event.node });
        break;
      case 'path':
        for (const node of event.nodes) {
          if (!samePos(node, input.start) && !samePos(node, input.end))
            path.push({ kind: 'path', node });
        }
        break;
      case 'done':
        ({ found, visited, pathLength } = event);
        break;
      case 'frontier':
        break;
    }
  }
  return {
    frames: [...visits, ...path],
    visitFrameCount: visits.length,
    found,
    visited,
    pathLength,
    durationMs,
  };
}

export type Overlay = (OverlayType | null)[][];

export type PlaybackStatus = 'idle' | 'running' | 'paused' | 'finished';

export interface PlaybackState {
  status: PlaybackStatus;
  run: RunResult | null;
  /** Number of frames applied so far. */
  cursor: number;
  overlay: Overlay | null;
  /** Most recently visited node, while the visit phase is playing. */
  current: Pos | null;
}

export type PlaybackAction =
  | { type: 'load'; run: RunResult; rows: number; cols: number }
  /** Apply up to `count` more frames (Infinity finishes). Works while running or paused (stepping). */
  | { type: 'advance'; count: number }
  | { type: 'pause' }
  | { type: 'resume' }
  | { type: 'reset' };

export const INITIAL_PLAYBACK: PlaybackState = {
  status: 'idle',
  run: null,
  cursor: 0,
  overlay: null,
  current: null,
};

function advance(state: PlaybackState, count: number): PlaybackState {
  const { run, overlay } = state;
  if (!run || !overlay || (state.status !== 'running' && state.status !== 'paused')) return state;

  const end = Math.min(run.frames.length, state.cursor + Math.max(0, count));
  const writer = gridWriter(overlay);
  let current = state.current;
  for (let i = state.cursor; i < end; i++) {
    const frame = run.frames[i]!;
    writer.set(frame.node, frame.kind === 'visit' ? 'visited' : 'path');
    current = frame.kind === 'visit' ? frame.node : null;
  }

  const finished = end >= run.frames.length;
  return {
    ...state,
    cursor: end,
    overlay: writer.result(),
    current: finished ? null : current,
    status: finished ? 'finished' : state.status,
  };
}

export function playbackReducer(state: PlaybackState, action: PlaybackAction): PlaybackState {
  switch (action.type) {
    case 'load': {
      const overlay: Overlay = Array.from({ length: action.rows }, () =>
        Array.from({ length: action.cols }, () => null),
      );
      const loaded: PlaybackState = {
        status: 'running',
        run: action.run,
        cursor: 0,
        overlay,
        current: null,
      };
      // Nothing to animate (e.g. start enclosed with zero frames) finishes right away.
      return action.run.frames.length === 0 ? { ...loaded, status: 'finished' } : loaded;
    }
    case 'advance':
      return advance(state, action.count);
    case 'pause':
      return state.status === 'running' ? { ...state, status: 'paused' } : state;
    case 'resume':
      return state.status === 'paused' ? { ...state, status: 'running' } : state;
    case 'reset':
      return state.status === 'idle' ? state : INITIAL_PLAYBACK;
  }
}

/** Number of visited frames shown so far (for the live Nodes Visited count). */
export function visitedSoFar(state: PlaybackState): number {
  return state.run ? Math.min(state.cursor, state.run.visitFrameCount) : 0;
}

export type Speed = 'slow' | 'normal' | 'fast' | 'instant';

export const SPEEDS: readonly { id: Speed; label: string }[] = [
  { id: 'slow', label: 'Slow' },
  { id: 'normal', label: 'Normal' },
  { id: 'fast', label: 'Fast' },
  { id: 'instant', label: 'Instant' },
];

/** Frames per second for the visit phase and the (slower, more deliberate) path phase. */
export const FRAME_RATES: Record<Exclude<Speed, 'instant'>, { visit: number; path: number }> = {
  slow: { visit: 12, path: 8 },
  normal: { visit: 75, path: 30 },
  fast: { visit: 300, path: 90 },
};
