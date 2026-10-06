import { ALGORITHMS } from '../algorithms';
import type { AlgorithmId } from '../algorithms/types';
import { ALGORITHM_INFO } from '../data/algorithms';
import { routeToHash } from '../lib/router';
import { Card } from './Card';
import { Icon } from './Icon';

interface AlgorithmSelectProps {
  value: AlgorithmId;
  onChange: (id: AlgorithmId) => void;
  disabled: boolean;
}

export function AlgorithmSelect({ value, onChange, disabled }: AlgorithmSelectProps) {
  return (
    <Card step={2} title="Choose Algorithm">
      <div className="relative">
        <label htmlFor="algorithm-select" className="sr-only">
          Algorithm
        </label>
        <select
          id="algorithm-select"
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value as AlgorithmId)}
          className="h-11 w-full cursor-pointer appearance-none rounded-control border border-border bg-surface-raised pl-3 pr-10 text-sm text-fg disabled:cursor-not-allowed disabled:opacity-50"
        >
          {ALGORITHMS.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name}
            </option>
          ))}
        </select>
        <Icon
          name="chevron-down"
          className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-fg"
        />
      </div>
      <p className="mt-3 text-sm leading-relaxed text-muted" aria-live="polite">
        {ALGORITHM_INFO[value].summary}
      </p>
      <a
        href={routeToHash({ page: 'learn', algorithmId: value })}
        className="mt-2 inline-flex items-center gap-1.5 rounded-control text-sm font-medium text-accent hover:underline"
      >
        Learn more
        <Icon name="arrow-right" className="h-4 w-4" />
      </a>
    </Card>
  );
}
