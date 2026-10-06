import { memo } from 'react';
import type { Tool } from '../lib/gridState';
import { Card } from './Card';
import { Icon } from './Icon';

const TOOLS: { id: Tool; label: string; iconClass: string }[] = [
  { id: 'select', label: 'Select', iconClass: 'text-accent' },
  { id: 'wall', label: 'Wall', iconClass: 'text-fg' },
  { id: 'start', label: 'Start', iconClass: 'text-cell-start' },
  { id: 'end', label: 'End', iconClass: 'text-cell-end' },
  { id: 'erase', label: 'Erase', iconClass: 'text-fg' },
];

interface ToolPanelProps {
  tool: Tool;
  onToolChange: (tool: Tool) => void;
  onClearWalls: () => void;
  canClearWalls: boolean;
  /** Drawing is locked while an animation is running or paused. */
  disabled: boolean;
}

/** Memoized: skips re-rendering on animation frames when its props are unchanged. */
export const ToolPanel = memo(function ToolPanel({
  tool,
  onToolChange,
  onClearWalls,
  canClearWalls,
  disabled,
}: ToolPanelProps) {
  return (
    <Card step={1} title="Drawing Tools" description="Click or drag on the grid to draw.">
      <div role="group" aria-label="Drawing tool" className="grid grid-cols-5 gap-2">
        {TOOLS.map(({ id, label, iconClass }) => {
          const active = tool === id;
          return (
            <button
              key={id}
              type="button"
              aria-label={`${label} tool`}
              aria-pressed={active}
              disabled={disabled}
              onClick={() => onToolChange(id)}
              className={`flex flex-col items-center gap-1.5 rounded-control border px-1 pb-2 pt-2.5 text-xs transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                active
                  ? 'border-accent bg-accent/10 text-accent'
                  : 'border-border bg-surface-raised text-fg/85 hover:border-muted/50'
              }`}
            >
              <Icon name={id} className={`h-6 w-6 ${iconClass}`} />
              {label}
            </button>
          );
        })}
      </div>
      <button
        type="button"
        onClick={onClearWalls}
        disabled={disabled || !canClearWalls}
        className="ml-auto mt-2 flex items-center gap-1.5 rounded-control px-1 py-1 text-xs text-muted transition-colors hover:text-fg disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:text-muted"
      >
        <Icon name="trash" className="h-3.5 w-3.5" />
        Clear Walls
      </button>
    </Card>
  );
});
