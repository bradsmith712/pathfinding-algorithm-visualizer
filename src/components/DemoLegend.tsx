const ITEMS: { label: string; swatch: string }[] = [
  { label: 'Empty', swatch: 'bg-cell-empty border border-border' },
  { label: 'Wall', swatch: 'bg-cell-wall' },
  { label: 'Start', swatch: 'bg-cell-start' },
  { label: 'Goal', swatch: 'bg-cell-end' },
  { label: 'Visited', swatch: 'bg-cell-visited' },
  { label: 'Current', swatch: 'bg-cell-visited-recent ring-2 ring-inset ring-cell-current' },
  { label: 'Path', swatch: 'path-cell' },
];

export function DemoLegend() {
  return (
    <ul aria-label="Legend" className="mt-3 flex flex-wrap gap-x-3 gap-y-2 text-xs text-fg/85">
      {ITEMS.map(({ label, swatch }) => (
        <li key={label} className="flex items-center gap-1.5">
          <span aria-hidden="true" className={`h-4 w-4 rounded-sm ${swatch}`} />
          {label}
        </li>
      ))}
    </ul>
  );
}
