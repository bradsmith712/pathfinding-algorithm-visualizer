import type { CellType, OverlayType } from '../algorithms/types';

/** Plain-language cell description for screen reader announcements. */
export function describeCell(type: CellType, overlay: OverlayType | null): string {
  switch (type) {
    case 'wall':
      return 'wall';
    case 'start':
      return 'start node';
    case 'end':
      return 'end node';
    case 'empty':
      return overlay === 'path' ? 'path' : overlay === 'visited' ? 'visited' : 'empty';
  }
}
