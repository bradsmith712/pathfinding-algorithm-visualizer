export interface Pos {
  row: number;
  col: number;
}

/**
 * Base cell types that make up the maze. Visited and path are overlays kept
 * separately (see OverlayType) so Reset can clear them without erasing walls.
 */
export type CellType = 'empty' | 'wall' | 'start' | 'end';

export type OverlayType = 'visited' | 'path';

export type StepEvent =
  /** Node expanded (removed from the open set and closed). */
  | { type: 'visit'; node: Pos }
  /** Node added to the open set. */
  | { type: 'frontier'; node: Pos }
  /** Final path, start to end inclusive. */
  | { type: 'path'; nodes: Pos[] }
  /** Always the last event. pathLength is the number of steps (edges); 0 when not found. */
  | { type: 'done'; found: boolean; visited: number; pathLength: number };

export interface AlgorithmInput {
  grid: CellType[][];
  start: Pos;
  end: Pos;
}

export type Algorithm = (input: AlgorithmInput) => Generator<StepEvent, void, void>;

export type AlgorithmId = 'astar' | 'dijkstra' | 'bfs' | 'dfs' | 'greedy';
