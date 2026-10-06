import { describe, expect, it } from 'vitest';
import { ALGORITHMS } from '../src/algorithms';
import { ALGORITHM_INFO } from '../src/data/algorithms';
import { DEMO_MAZE, DEMO_MAZE_ROWS } from '../src/data/demoMaze';
import { gridFromRows } from '../src/lib/grid';
import { expectValidPath, run } from './helpers';

describe('algorithm content', () => {
  it('has an entry for every registered algorithm and nothing else', () => {
    expect(Object.keys(ALGORITHM_INFO).sort()).toEqual(ALGORITHMS.map((a) => a.id).sort());
  });

  describe.each(ALGORITHMS)('$name', ({ id }) => {
    const info = ALGORITHM_INFO[id];

    it('has the text every Learn section needs', () => {
      for (const text of [info.subtitle, info.summary, info.intro])
        expect(text.trim()).not.toBe('');
      expect(info.features).toHaveLength(3);
      for (const f of info.features) {
        expect(f.title.trim()).not.toBe('');
        expect(f.description.trim()).not.toBe('');
      }
      expect(info.keyConcepts.length).toBeGreaterThanOrEqual(3);
      expect(info.useCases.length).toBeGreaterThanOrEqual(3);
      expect(info.complexity.where.length).toBeGreaterThan(0);
    });

    it('has the four demo steps in order', () => {
      expect(info.steps.map((s) => s.title)).toEqual([
        'Initialize',
        'Explore',
        'Prioritize',
        'Find Path',
      ]);
      for (const step of info.steps) expect(step.body.trim()).not.toBe('');
    });

    it('has pseudo-code that opens with a function line and ends with failure', () => {
      expect(info.pseudoCode[0]).toMatch(/^function /);
      expect(info.pseudoCode.at(-1)?.trim()).toBe('return failure');
    });
  });

  it('marks only A*, Dijkstra and BFS as optimal', () => {
    const optimal = ALGORITHMS.filter((a) => ALGORITHM_INFO[a.id].complexity.optimal).map(
      (a) => a.id,
    );
    expect(optimal).toEqual(['astar', 'dijkstra', 'bfs']);
  });

  it("shows A*'s f(n) = g(n) + h(n) in the Initialize step", () => {
    expect(ALGORITHM_INFO.astar.steps[0].formula).toBe('f(n) = g(n) + h(n)');
    expect(ALGORITHM_INFO.astar.steps[0].terms?.map((t) => t.term)).toEqual([
      'g(n)',
      'h(n)',
      'f(n)',
    ]);
  });
});

describe('demo maze', () => {
  it('is 14 columns by 8 rows', () => {
    expect(DEMO_MAZE.grid).toHaveLength(8);
    expect(DEMO_MAZE.grid.every((row) => row.length === 14)).toBe(true);
  });

  it('lets every algorithm find a valid path', () => {
    for (const { run: algorithm } of ALGORITHMS) {
      const result = run(algorithm, DEMO_MAZE);
      expect(result.done.found).toBe(true);
      expectValidPath(DEMO_MAZE, result.path);
    }
  });

  it('shows the differences the demo is meant to teach', () => {
    const r = Object.fromEntries(ALGORITHMS.map((a) => [a.id, run(a.run, DEMO_MAZE).done]));
    const optimal = r.bfs!.pathLength;
    expect(r.astar!.pathLength).toBe(optimal);
    expect(r.dijkstra!.pathLength).toBe(optimal);
    expect(r.astar!.visited).toBeLessThan(r.dijkstra!.visited / 2);
    expect(r.greedy!.pathLength).toBeGreaterThan(optimal);
    expect(r.dfs!.pathLength).toBeGreaterThan(r.greedy!.pathLength);
  });
});

describe('gridFromRows', () => {
  it('parses start, end, walls and empty cells', () => {
    const { grid, start, end } = gridFromRows(['S#', '.E']);
    expect(grid).toEqual([
      ['start', 'wall'],
      ['empty', 'end'],
    ]);
    expect(start).toEqual({ row: 0, col: 0 });
    expect(end).toEqual({ row: 1, col: 1 });
  });

  it('rejects unknown characters and missing endpoints', () => {
    expect(() => gridFromRows(['S?E'])).toThrow(/Unexpected/);
    expect(() => gridFromRows(['S..'])).toThrow(/S and E/);
  });

  it('accepts the readonly demo rows', () => {
    expect(gridFromRows(DEMO_MAZE_ROWS).start).toEqual({ row: 1, col: 1 });
  });
});
