import { useRef, type KeyboardEvent } from 'react';
import { DEMO_PANEL_ID, demoTabId } from '../lib/demoIds';
import type { DemoPhase } from '../lib/playback';

interface StepTabsProps {
  titles: readonly string[];
  active: DemoPhase;
  onSelect: (tab: DemoPhase) => void;
}

/**
 * Initialize → Explore → Prioritize → Find Path. The active tab follows the
 * demo's progress; clicking a tab (or using the arrow keys) shows that step's
 * explanation until the demo moves on.
 */
export function StepTabs({ titles, active, onSelect }: StepTabsProps) {
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const last = titles.length - 1;
    const next =
      e.key === 'ArrowRight'
        ? active === last
          ? 0
          : active + 1
        : e.key === 'ArrowLeft'
          ? active === 0
            ? last
            : active - 1
          : e.key === 'Home'
            ? 0
            : e.key === 'End'
              ? last
              : undefined;
    if (next === undefined) return;
    e.preventDefault();
    onSelect(next as DemoPhase);
    tabs.current[next]?.focus();
  };

  return (
    <div
      role="tablist"
      aria-label="Algorithm steps"
      onKeyDown={onKeyDown}
      className="flex flex-wrap gap-x-6 gap-y-2"
    >
      {titles.map((title, i) => {
        const selected = i === active;
        return (
          <button
            key={title}
            ref={(el) => {
              tabs.current[i] = el;
            }}
            id={demoTabId(i)}
            type="button"
            role="tab"
            aria-selected={selected}
            aria-controls={DEMO_PANEL_ID}
            tabIndex={selected ? 0 : -1}
            onClick={() => onSelect(i as DemoPhase)}
            className={`relative flex items-center gap-2 rounded-control pb-2 pt-1 text-sm transition-colors ${
              selected ? 'text-accent' : 'text-muted hover:text-fg'
            }`}
          >
            <span
              aria-hidden="true"
              className={`flex h-6 w-6 items-center justify-center rounded-full border text-xs font-semibold ${
                selected ? 'border-accent bg-accent text-bg' : 'border-muted/60'
              }`}
            >
              {i + 1}
            </span>
            {title}
            {selected && (
              <span
                aria-hidden="true"
                className="absolute bottom-0 left-8 right-0 h-0.5 rounded-full bg-accent"
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
