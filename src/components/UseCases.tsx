import { Card } from './Card';

interface UseCasesProps {
  items: readonly string[];
}

export function UseCases({ items }: UseCasesProps) {
  return (
    <Card icon="target" iconClass="text-tone-blue" title="Use Cases">
      <ul className="flex list-disc flex-col gap-1.5 pl-5 text-sm leading-relaxed text-fg/85 marker:text-fg">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </Card>
  );
}
