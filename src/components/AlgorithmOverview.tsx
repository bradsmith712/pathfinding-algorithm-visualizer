import type { AlgorithmId } from '../algorithms/types';
import { getAlgorithm } from '../algorithms';
import { ALGORITHM_INFO } from '../data/algorithms';
import { FeatureCard } from './FeatureCard';

interface AlgorithmOverviewProps {
  id: AlgorithmId;
}

/** Title, intro paragraph and the three feature cards. */
export function AlgorithmOverview({ id }: AlgorithmOverviewProps) {
  const { name } = getAlgorithm(id);
  const { intro, features } = ALGORITHM_INFO[id];

  return (
    <section aria-labelledby="algorithm-title">
      <h1 id="algorithm-title" className="text-[2rem] font-bold leading-tight tracking-tight">
        {name}
      </h1>
      <p className="mt-3 text-[15px] leading-relaxed text-fg/85">{intro}</p>
      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        {features.map((feature) => (
          <FeatureCard key={feature.title} {...feature} />
        ))}
      </div>
    </section>
  );
}
