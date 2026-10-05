import type { Tool } from '../lib/gridState';
import { Card } from './Card';
import { Icon } from './Icon';

const TOOLS: { id: Tool; label: string; iconClass: string }[] = [
  { id: 'select', label: 'Select', iconClass: 'text-muted' },
  { id: 'wall', label: 'Wall', iconClass: 'text-cell-wall' },
  { id: 'start', label: 'Start', iconClass: 'text-cell-start' },
  { id: 'end', label: 'End', iconClass: 'text-cell-end' },
  { id: 'erase', label: 'Erase', iconClass: 'text-muted' },
];

interface ToolPanelProps {
  tool: Tool;
  onToolChange: (tool: Tool) => void;
  onClearWalls: () => void;
  canClearWalls: boolean;
  /** Drawing is locked while an animation is running or paused. */
  disabled: boolean;
}

export function ToolPanel({
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
              aria-pressed={active}
              disabled={disabled}
              onClick={() => onToolChange(id)}
              className={`flex flex-col items-center gap-1 rounded-control border px-1 py-2 text-xs font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                active
                  ? 'border-accent bg-accent/10 text-fg'
                  : 'border-border bg-surface-raised text-muted hover:text-fg'
              }`}
            >
              <Icon name={id} className={`h-5 w-5 ${iconClass}`} />
              {label}
            </button>
          );
        })}
      </div>
      <button
        type="button"
        onClick={onClearWalls}
        disabled={disabled || !canClearWalls}
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-control border border-border px-3 py-1.5 text-sm text-muted transition-colors hover:text-fg disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:text-muted"
      >
        <Icon name="trash" className="h-4 w-4" />
        Clear Walls
      </button>
    </Card>
  );
}
