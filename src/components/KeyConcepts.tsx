import type { Term } from '../data/algorithms';
import { Card } from './Card';

interface KeyConceptsProps {
  concepts: readonly Term[];
}

export function KeyConcepts({ concepts }: KeyConceptsProps) {
  return (
    <Card icon="bulb" iconClass="text-tone-yellow" title="Key Concepts">
      <dl className="flex flex-col gap-4">
        {concepts.map(({ term, definition }) => (
          <div key={term}>
            <dt className="font-semibold">{term}</dt>
            <dd className="mt-1 text-sm leading-relaxed text-fg/80">{definition}</dd>
          </div>
        ))}
      </dl>
    </Card>
  );
}
