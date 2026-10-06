import { ALGORITHMS } from '../algorithms';
import type { AlgorithmId } from '../algorithms/types';
import { ALGORITHM_INFO } from '../data/algorithms';
import { routeToHash } from '../lib/router';
import { TONE_TEXT } from '../lib/tones';
import { Icon } from './Icon';

interface AlgorithmListProps {
  selected: AlgorithmId;
}

/** Learn page sidebar. Each entry is a link, so selection lives in the URL (#/learn/<id>). */
export function AlgorithmList({ selected }: AlgorithmListProps) {
  return (
    <nav
      aria-labelledby="algorithm-list-heading"
      className="rounded-card border border-border bg-surface p-3"
    >
      <div className="px-2 pb-3 pt-1">
        <h2 id="algorithm-list-heading" className="text-lg font-semibold">
          Algorithms
        </h2>
        <p className="mt-1 text-sm text-muted">Click an algorithm to learn more.</p>
      </div>
      <ul className="flex flex-col gap-2">
        {ALGORITHMS.map(({ id, name }) => {
          const info = ALGORITHM_INFO[id];
          const active = id === selected;
          return (
            <li key={id}>
              <a
                href={routeToHash({ page: 'learn', algorithmId: id })}
                aria-current={active ? 'page' : undefined}
                className={`flex items-center gap-3 rounded-card border px-3 py-3.5 transition-colors ${
                  active
                    ? 'border-accent bg-accent/15'
                    : 'border-border bg-surface-raised/50 hover:border-muted/50'
                }`}
              >
                <Icon
                  name={info.icon}
                  className={`mx-1 h-7 w-7 shrink-0 ${TONE_TEXT[info.tone]}`}
                />
                <span className="flex min-w-0 flex-col">
                  <span className="text-[15px] font-semibold">{name}</span>
                  <span className="text-[13px] text-muted">{info.subtitle}</span>
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
