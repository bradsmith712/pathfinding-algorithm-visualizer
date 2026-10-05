import { describe, expect, it } from 'vitest';
import { createGridState, gridReducer, hasWalls, type GridState } from '../src/lib/gridState';

const fresh = () => createGridState(5, 6, { row: 0, col: 0 }, { row: 4, col: 5 });

function countOf(state: GridState, type: string): number {
  return state.cells.flat().filter((c) => c === type).length;
}

describe('createGridState', () => {
  it('places one start and one end', () => {
    const state = fresh();
    expect(state.cells).toHaveLength(5);
    expect(state.cells[0]).toHaveLength(6);
    expect(state.cells[0]![0]).toBe('start');
    expect(state.cells[4]![5]).toBe('end');
    expect(countOf(state, 'start')).toBe(1);
    expect(countOf(state, 'end')).toBe(1);
  });

  it('uses the default size and positions', () => {
    const state = createGridState();
    expect(state.cells).toHaveLength(29);
    expect(state.cells[0]).toHaveLength(28);
    expect(state.cells[state.start.row]![state.start.col]).toBe('start');
    expect(state.cells[state.end.row]![state.end.col]).toBe('end');
  });
});

describe('gridReducer paint', () => {
  it('paints walls on empty cells only', () => {
    const state = gridReducer(fresh(), {
      type: 'paint',
      tool: 'wall',
      positions: [
        { row: 0, col: 0 },
        { row: 1, col: 1 },
        { row: 4, col: 5 },
        { row: 9, col: 9 },
      ],
    });
    expect(state.cells[1]![1]).toBe('wall');
    expect(state.cells[0]![0]).toBe('start');
    expect(state.cells[4]![5]).toBe('end');
    expect(countOf(state, 'wall')).toBe(1);
  });

  it('erases walls but not start or end', () => {
    let state = gridReducer(fresh(), {
      type: 'paint',
      tool: 'wall',
      positions: [{ row: 2, col: 2 }],
    });
    state = gridReducer(state, {
      type: 'paint',
      tool: 'erase',
      positions: [
        { row: 2, col: 2 },
        { row: 0, col: 0 },
      ],
    });
    expect(state.cells[2]![2]).toBe('empty');
    expect(state.cells[0]![0]).toBe('start');
  });

  it('moves the start, replacing a wall, and keeps exactly one', () => {
    let state = gridReducer(fresh(), {
      type: 'paint',
      tool: 'wall',
      positions: [{ row: 2, col: 3 }],
    });
    state = gridReducer(state, { type: 'paint', tool: 'start', positions: [{ row: 2, col: 3 }] });
    expect(state.start).toEqual({ row: 2, col: 3 });
    expect(state.cells[2]![3]).toBe('start');
    expect(state.cells[0]![0]).toBe('empty');
    expect(countOf(state, 'start')).toBe(1);
  });

  it('moves the end to the last position of a drag', () => {
    const state = gridReducer(fresh(), {
      type: 'paint',
      tool: 'end',
      positions: [
        { row: 3, col: 3 },
        { row: 3, col: 4 },
      ],
    });
    expect(state.end).toEqual({ row: 3, col: 4 });
    expect(countOf(state, 'end')).toBe(1);
  });

  it('will not place start on end or end on start', () => {
    const state = fresh();
    expect(gridReducer(state, { type: 'paint', tool: 'start', positions: [state.end] })).toBe(
      state,
    );
    expect(gridReducer(state, { type: 'paint', tool: 'end', positions: [state.start] })).toBe(
      state,
    );
  });

  it('returns the same state when nothing changes', () => {
    const state = fresh();
    expect(
      gridReducer(state, { type: 'paint', tool: 'erase', positions: [{ row: 1, col: 1 }] }),
    ).toBe(state);
    expect(gridReducer(state, { type: 'paint', tool: 'start', positions: [state.start] })).toBe(
      state,
    );
    expect(
      gridReducer(state, { type: 'paint', tool: 'wall', positions: [{ row: -1, col: 0 }] }),
    ).toBe(state);
  });

  it('only copies rows that changed', () => {
    const state = fresh();
    const next = gridReducer(state, {
      type: 'paint',
      tool: 'wall',
      positions: [{ row: 2, col: 2 }],
    });
    expect(next.cells).not.toBe(state.cells);
    expect(next.cells[2]).not.toBe(state.cells[2]);
    expect(next.cells[1]).toBe(state.cells[1]);
    expect(state.cells[2]![2]).toBe('empty');
  });
});

describe('gridReducer clearWalls', () => {
  it('removes every wall and keeps start and end', () => {
    let state = gridReducer(fresh(), {
      type: 'paint',
      tool: 'wall',
      positions: [
        { row: 1, col: 1 },
        { row: 3, col: 4 },
      ],
    });
    expect(hasWalls(state)).toBe(true);
    state = gridReducer(state, { type: 'clearWalls' });
    expect(hasWalls(state)).toBe(false);
    expect(state.cells[0]![0]).toBe('start');
    expect(state.cells[4]![5]).toBe('end');
  });

  it('returns the same state when there are no walls', () => {
    const state = fresh();
    expect(gridReducer(state, { type: 'clearWalls' })).toBe(state);
  });
});
