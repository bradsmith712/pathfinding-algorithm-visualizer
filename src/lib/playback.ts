import type { Algorithm, AlgorithmInput, OverlayType, Pos } from '../algorithms/types';
import { gridWriter, samePos } from './grid';

/** One animation step. */
export type Frame =
  | { kind: 'visit'; node: Pos }
  /** Neighbors added to the open set after a visit (Learn demo only; draws nothing). */
  | { kind: 'frontier'; nodes: Pos[] }
  | { kind: 'path'; node: Pos };

export interface RunResult {
  /** Search frames (visits, plus frontier groups if requested), then the path frames. */
  frames: Frame[];
  /** Index of the first path frame (equals frames.length when there is no path). */
  pathStart: number;
  found: boolean;
  visited: number;
  pathLength: number;
  /** Time spent computing the search, excluding any animation. */
  durationMs: number;
}

export interface RunOptions {
  /** Emit a frontier frame after each visit that added neighbors (for the Learn demo's Prioritize step). */
  frontier?: boolean;
  /** Clock used to time the computation. */
  now?: () => number;
}

/**
 * Runs the algorithm to completion, timing only the computation, and turns
 * its step events into animation frames. Path frames skip start and end,
 * which are always drawn on top anyway.
 */
export function runAlgorithm(
  algorithm: Algorithm,
  input: AlgorithmInput,
  { frontier = false, now = () => performance.now() }: RunOptions = {},
): RunResult {
  const t0 = now();
  const events = [...algorithm(input)];
  const durationMs = now() - t0;

  const search: Frame[] = [];
  const path: Frame[] = [];
  let found = false;
  let visited = 0;
  let pathLength = 0;
  for (const event of events) {
    switch (event.type) {
      case 'visit':
        search.push({ kind: 'visit', node: event.node });
        break;
      case 'frontier': {
        if (!frontier) break;
        const last = search.at(-1);
        // Group all neighbors added after one visit into a single frame.
        if (last?.kind === 'frontier') last.nodes.push(event.node);
        else search.push({ kind: 'frontier', nodes: [event.node] });
        break;
      }
      case 'path':
        for (const node of event.nodes) {
          if (!samePos(node, input.start) && !samePos(node, input.end))
            path.push({ kind: 'path', node });
        }
        break;
      case 'done':
        ({ found, visited, pathLength } = event);
        break;
    }
  }
  return {
    frames: [...search, ...path],
    pathStart: search.length,
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
  /** Most recently visited node, while the search phase is playing. */
  current: Pos | null;
  /** Visit frames applied so far (the live Nodes Visited count). */
  visitedShown: number;
}

export type PlaybackAction =
  /** Load a run. Starts running, or paused at the beginning when `paused` (for stepping). */
  | { type: 'load'; run: RunResult; rows: number; cols: number; paused?: boolean }
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
  visitedShown: 0,
};

function advance(state: PlaybackState, count: number): PlaybackState {
  const { run, overlay } = state;
  if (!run || !overlay || (state.status !== 'running' && state.status !== 'paused')) return state;

  const end = Math.min(run.frames.length, state.cursor + Math.max(0, count));
  const writer = gridWriter(overlay);
  let { current, visitedShown } = state;
  for (let i = state.cursor; i < end; i++) {
    const frame = run.frames[i]!;
    switch (frame.kind) {
      case 'visit':
        writer.set(frame.node, 'visited');
        current = frame.node;
        visitedShown++;
        break;
      case 'frontier':
        break;
      case 'path':
        writer.set(frame.node, 'path');
        current = null;
        break;
    }
  }

  const finished = end >= run.frames.length;
  return {
    ...state,
    cursor: end,
    overlay: writer.result(),
    current: finished ? null : current,
    visitedShown,
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
        ...INITIAL_PLAYBACK,
        status: action.paused ? 'paused' : 'running',
        run: action.run,
        overlay,
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

/** Learn demo phases, matching the step tabs: Initialize, Explore, Prioritize, Find Path. */
export type DemoPhase = 0 | 1 | 2 | 3;

/** Which demo step the playback is in, judged by the last frame applied. */
export function demoPhase(state: PlaybackState): DemoPhase {
  if (state.status === 'finished') return 3;
  const last = state.cursor > 0 ? state.run?.frames[state.cursor - 1] : undefined;
  switch (last?.kind) {
    case undefined:
      return 0;
    case 'visit':
      return 1;
    case 'frontier':
      return 2;
    case 'path':
      return 3;
  }
}

export type Speed = 'slow' | 'normal' | 'fast' | 'instant';

export const SPEEDS: readonly { id: Speed; label: string }[] = [
  { id: 'slow', label: 'Slow' },
  { id: 'normal', label: 'Normal' },
  { id: 'fast', label: 'Fast' },
  { id: 'instant', label: 'Instant' },
];

/** Frames per second for the search phase and the (slower, more deliberate) path phase. */
export interface FrameRate {
  search: number;
  path: number;
}

export const FRAME_RATES: Record<Exclude<Speed, 'instant'>, FrameRate> = {
  slow: { search: 12, path: 8 },
  normal: { search: 75, path: 30 },
  fast: { search: 300, path: 90 },
};

/** Learn demo playback: slow enough to follow each Explore/Prioritize step. */
export const DEMO_FRAME_RATE: FrameRate = { search: 7, path: 10 };
