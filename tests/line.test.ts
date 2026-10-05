import { describe, expect, it } from 'vitest';
import { lineBetween } from '../src/lib/line';

describe('lineBetween', () => {
  it('returns a single cell when both ends match', () => {
    expect(lineBetween({ row: 2, col: 2 }, { row: 2, col: 2 })).toEqual([{ row: 2, col: 2 }]);
  });

  it('draws horizontal, vertical and diagonal lines inclusively', () => {
    expect(lineBetween({ row: 0, col: 0 }, { row: 0, col: 3 })).toHaveLength(4);
    expect(lineBetween({ row: 3, col: 1 }, { row: 0, col: 1 })).toEqual([
      { row: 3, col: 1 },
      { row: 2, col: 1 },
      { row: 1, col: 1 },
      { row: 0, col: 1 },
    ]);
    expect(lineBetween({ row: 0, col: 0 }, { row: 2, col: 2 })).toEqual([
      { row: 0, col: 0 },
      { row: 1, col: 1 },
      { row: 2, col: 2 },
    ]);
  });

  it('has no gaps on shallow lines', () => {
    const line = lineBetween({ row: 0, col: 0 }, { row: 2, col: 7 });
    expect(line[0]).toEqual({ row: 0, col: 0 });
    expect(line.at(-1)).toEqual({ row: 2, col: 7 });
    for (let i = 1; i < line.length; i++) {
      expect(Math.abs(line[i]!.row - line[i - 1]!.row)).toBeLessThanOrEqual(1);
      expect(Math.abs(line[i]!.col - line[i - 1]!.col)).toBeLessThanOrEqual(1);
    }
    expect(line).toHaveLength(8);
  });
});
