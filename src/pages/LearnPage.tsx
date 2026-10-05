interface LearnPageProps {
  algorithmId?: string;
}

export function LearnPage({ algorithmId }: LearnPageProps) {
  return (
    <section aria-labelledby="learn-heading" className="p-6">
      <h2 id="learn-heading" className="text-xl font-semibold">
        Learn
      </h2>
      <p className="text-muted">
        Algorithm explanations coming soon{algorithmId ? ` (selected: ${algorithmId})` : ''}.
      </p>
    </section>
  );
}
