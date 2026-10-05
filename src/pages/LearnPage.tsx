import { Card } from '../components/Card';

interface LearnPageProps {
  algorithmId?: string;
}

// Layout shell only; content is built in Phase 5.
export function LearnPage({ algorithmId }: LearnPageProps) {
  return (
    <div className="mx-auto grid max-w-[1600px] gap-4 p-4 lg:grid-cols-[16rem_minmax(0,1fr)_18rem]">
      <aside aria-label="Algorithms" className="flex flex-col gap-4">
        <Card title="Algorithms" description="Click an algorithm to learn more." />
      </aside>

      <section aria-label="Algorithm details" className="flex min-w-0 flex-col gap-4">
        <Card
          title="How it works"
          description={`Algorithm explanations coming soon${algorithmId ? ` (selected: ${algorithmId})` : ''}.`}
        />
      </section>

      <aside aria-label="Reference" className="flex flex-col gap-4">
        <Card title="Key Concepts" />
        <Card title="Time & Space Complexity" />
        <Card title="Use Cases" />
      </aside>
    </div>
  );
}
