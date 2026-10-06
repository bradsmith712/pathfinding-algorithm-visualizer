import { Card } from './Card';

const ITEMS: { label: string; swatch: string }[] = [
  { label: 'Empty Node', swatch: 'bg-cell-empty border border-border' },
  { label: 'Wall', swatch: 'bg-cell-wall' },
  { label: 'Start Node', swatch: 'bg-cell-start' },
  { label: 'End Node', swatch: 'bg-cell-end' },
  { label: 'Visited Node', swatch: 'bg-cell-visited' },
  { label: 'Path', swatch: 'path-cell' },
];

export function Legend() {
  return (
    <Card icon="layers" title="Legend">
      <ul className="flex flex-col gap-3">
        {ITEMS.map(({ label, swatch }) => (
          <li key={label} className="flex items-center gap-3 text-sm">
            <span aria-hidden="true" className={`h-6 w-6 shrink-0 rounded ${swatch}`} />
            {label}
          </li>
        ))}
      </ul>
    </Card>
  );
}
