import type { ReactNode } from 'react';
import type { Complexity } from '../data/algorithms';
import { Card } from './Card';

/** Renders "O(b^d)" with the exponent as a superscript. */
function notation(text: string): ReactNode {
  return text.split(/\^(\w+)/).map((part, i) => (i % 2 === 1 ? <sup key={i}>{part}</sup> : part));
}

const yesNo = (value: boolean) => (value ? 'Yes' : 'No');

interface ComplexityCardProps {
  complexity: Complexity;
}

export function ComplexityCard({ complexity: c }: ComplexityCardProps) {
  const rows: { label: string; value: ReactNode; note?: string }[] = [
    { label: 'Time Complexity', value: notation(c.time), note: c.timeNote },
    { label: 'Space Complexity', value: notation(c.space), note: c.spaceNote },
    { label: 'Optimal Path', value: yesNo(c.optimal), note: c.optimalNote },
    { label: 'Complete', value: yesNo(c.complete), note: c.completeNote },
    { label: 'Typical Performance', value: c.performance },
  ];

  return (
    <Card icon="chart" title="Time & Space Complexity">
      <dl className="flex flex-col gap-3 text-sm">
        {rows.map(({ label, value, note }) => (
          <div key={label} className="flex items-start justify-between gap-3">
            <dt className="text-fg/85">{label}</dt>
            <dd className="text-right">
              <span className="font-medium">{value}</span>
              {note && <span className="block text-xs text-muted">({note})</span>}
            </dd>
          </div>
        ))}
      </dl>
      <div className="mt-4 border-t border-border pt-3 text-sm text-fg/80">
        <p>Where:</p>
        <ul>
          {c.where.map(({ term, definition }) => (
            <li key={term}>
              {term} = {definition}
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}
