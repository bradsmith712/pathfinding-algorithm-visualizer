import { describe, expect, it } from 'vitest';
import { highlightLine } from '../src/lib/highlight';
import { ALGORITHM_INFO } from '../src/data/algorithms';

describe('highlightLine', () => {
  it('colors keywords, function calls and numbers', () => {
    expect(highlightLine('  gScore[start] = 0')).toEqual([
      { text: '  gScore[start] = ', kind: 'plain' },
      { text: '0', kind: 'number' },
    ]);
    expect(highlightLine('function A*(start, goal):')).toEqual([
      { text: 'function', kind: 'keyword' },
      { text: ' ', kind: 'plain' },
      { text: 'A*', kind: 'function' },
      { text: '(start, goal):', kind: 'plain' },
    ]);
    expect(highlightLine('    for each neighbor in getNeighbors(current):')).toEqual([
      { text: '    ', kind: 'plain' },
      { text: 'for', kind: 'keyword' },
      { text: ' ', kind: 'plain' },
      { text: 'each', kind: 'keyword' },
      { text: ' neighbor ', kind: 'plain' },
      { text: 'in', kind: 'keyword' },
      { text: ' ', kind: 'plain' },
      { text: 'getNeighbors', kind: 'function' },
      { text: '(current):', kind: 'plain' },
    ]);
  });

  it('does not treat keywords inside identifiers as keywords', () => {
    expect(highlightLine('notes = isolated + index')).toEqual([
      { text: 'notes = isolated + index', kind: 'plain' },
    ]);
  });

  it('returns no tokens for an empty line', () => {
    expect(highlightLine('')).toEqual([]);
  });

  it('round-trips every pseudo-code line exactly', () => {
    for (const info of Object.values(ALGORITHM_INFO)) {
      for (const line of info.pseudoCode) {
        expect(
          highlightLine(line)
            .map((t) => t.text)
            .join(''),
        ).toBe(line);
      }
    }
  });
});
