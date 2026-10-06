import type { DemoStep } from '../data/algorithms';
import { DEMO_PANEL_ID, demoTabId } from '../lib/demoIds';

interface StepExplanationProps {
  step: DemoStep;
  index: number;
}

export function StepExplanation({ step, index }: StepExplanationProps) {
  return (
    <div
      id={DEMO_PANEL_ID}
      role="tabpanel"
      aria-labelledby={demoTabId(index)}
      tabIndex={0}
      className="rounded-control"
    >
      <h3 className="font-semibold">
        Step {index + 1}: {step.title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-fg/85">{step.body}</p>
      {step.formula && (
        <p className="mt-3 rounded-control border border-border bg-bg px-3 py-3 text-center font-mono text-sm">
          {step.formula}
        </p>
      )}
      {step.terms && (
        <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
          {step.terms.map(({ term, definition }) => (
            <div key={term} className="contents">
              <dt className="font-mono text-fg/85">{term}</dt>
              <dd className="text-muted">{definition}</dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  );
}
