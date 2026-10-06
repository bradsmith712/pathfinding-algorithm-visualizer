import { describe, expect, it } from 'vitest';
import { describeCell } from '../src/lib/describeCell';

describe('describeCell', () => {
  it('names base cell types', () => {
    expect(describeCell('wall', null)).toBe('wall');
    expect(describeCell('start', null)).toBe('start node');
    expect(describeCell('end', null)).toBe('end node');
    expect(describeCell('empty', null)).toBe('empty');
  });

  it('reports overlays on empty cells', () => {
    expect(describeCell('empty', 'visited')).toBe('visited');
    expect(describeCell('empty', 'path')).toBe('path');
  });

  it('lets start and end win over overlays, as they are drawn', () => {
    expect(describeCell('start', 'visited')).toBe('start node');
    expect(describeCell('end', 'path')).toBe('end node');
  });
});
