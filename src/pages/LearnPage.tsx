import { useEffect, useRef } from 'react';
import { DEFAULT_ALGORITHM_ID, isAlgorithmId } from '../algorithms';
import { AlgorithmList } from '../components/AlgorithmList';
import { AlgorithmOverview } from '../components/AlgorithmOverview';
import { ComplexityCard } from '../components/ComplexityCard';
import { KeyConcepts } from '../components/KeyConcepts';
import { MiniDemo } from '../components/MiniDemo';
import { PseudoCode } from '../components/PseudoCode';
import { UseCases } from '../components/UseCases';
import { ALGORITHM_INFO } from '../data/algorithms';

interface LearnPageProps {
  /** From the URL (#/learn/<id>); unknown or missing ids fall back to A*. */
  algorithmId?: string;
}

export function LearnPage({ algorithmId }: LearnPageProps) {
  const id = algorithmId && isAlgorithmId(algorithmId) ? algorithmId : DEFAULT_ALGORITHM_ID;
  const info = ALGORITHM_INFO[id];

  // On narrow screens the list sits above the content: after picking an
  // algorithm, bring its title into view if it's off screen.
  const contentRef = useRef<HTMLDivElement>(null);
  const previousId = useRef(id);
  useEffect(() => {
    if (previousId.current === id) return;
    previousId.current = id;
    const el = contentRef.current;
    if (el && el.getBoundingClientRect().top > window.innerHeight * 0.5) el.scrollIntoView();
  }, [id]);

  return (
    <div className="mx-auto grid max-w-[1600px] gap-5 p-4 md:px-6 lg:grid-cols-[19rem_minmax(0,1fr)] xl:grid-cols-[19rem_minmax(0,1fr)_18rem]">
      <aside className="flex flex-col gap-4">
        <AlgorithmList selected={id} />
      </aside>

      <div ref={contentRef} className="flex min-w-0 scroll-mt-4 flex-col gap-5">
        <AlgorithmOverview id={id} />
        {/* Keyed so switching algorithm starts a fresh demo. */}
        <MiniDemo key={id} id={id} />
        <PseudoCode lines={info.pseudoCode} />
      </div>

      <aside
        aria-label="Reference"
        className="flex flex-col gap-4 lg:col-start-2 xl:col-start-auto"
      >
        <KeyConcepts concepts={info.keyConcepts} />
        <ComplexityCard complexity={info.complexity} />
        <UseCases items={info.useCases} />
      </aside>
    </div>
  );
}
