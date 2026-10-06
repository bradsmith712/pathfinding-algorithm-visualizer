import type { ReactNode } from 'react';
import { ALGORITHMS } from '../algorithms';
import { Card } from '../components/Card';
import { ALGORITHM_INFO } from '../data/algorithms';
import { GITHUB_URL, LICENSE_URL } from '../lib/links';
import { routeToHash } from '../lib/router';

const STEPS: ReactNode[] = [
  <>
    Pick <strong>Wall</strong> in Drawing Tools, then click or drag on the grid to draw walls.{' '}
    <strong>Erase</strong> removes them.
  </>,
  <>
    Use <strong>Start</strong> and <strong>End</strong> to move the green start node and the red end
    node.
  </>,
  <>Choose an algorithm. The short description explains what makes it different.</>,
  <>
    Press <strong>Start</strong> to watch the search. Visited nodes fill in blue, then the path is
    traced from start to end.
  </>,
  <>
    Use <strong>Pause</strong>, <strong>Reset</strong> and the <strong>Speed</strong> slider to
    control the animation. Reset keeps your walls.
  </>,
  <>
    Open <strong>Learn</strong> to step through each algorithm on a small maze, with pseudo-code and
    complexity.
  </>,
];

const KEYS: { keys: string; action: string }[] = [
  { keys: 'Tab', action: 'Move between controls and into the grid' },
  { keys: 'Arrow keys', action: 'Move the cursor on the grid' },
  { keys: 'Space or Enter', action: 'Apply the selected drawing tool at the cursor' },
  { keys: 'Shift + Arrow keys', action: 'Draw walls or erase while moving' },
  { keys: 'Home / End', action: 'Jump to the start or end of the row' },
  { keys: 'Left / Right', action: 'Switch step tabs in the Learn demo' },
];

const LINK = 'font-medium text-accent hover:underline';

export function AboutPage() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-5 p-4 md:px-6">
      <section aria-labelledby="about-title">
        <h1 id="about-title" className="text-[2rem] font-bold leading-tight tracking-tight">
          About
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed text-fg/85">
          Pathfinding Visualizer is an interactive way to see how five classic search algorithms
          find their way through a maze. Draw walls, place a start and an end, and watch each
          algorithm explore the grid one node at a time. Then visit the Learn page to see why they
          behave so differently.
        </p>
      </section>

      <Card title="How to use">
        <ol className="flex list-decimal flex-col gap-2 pl-5 text-sm leading-relaxed text-fg/85 marker:font-semibold marker:text-accent">
          {STEPS.map((step, i) => (
            <li key={i}>{step}</li>
          ))}
        </ol>
      </Card>

      <Card title="Keyboard">
        <dl className="grid gap-x-6 gap-y-2 text-sm sm:grid-cols-[auto_1fr]">
          {KEYS.map(({ keys, action }) => (
            <div key={keys} className="contents">
              <dt>
                <kbd className="rounded border border-border bg-surface-raised px-1.5 py-0.5 font-sans text-xs font-semibold">
                  {keys}
                </kbd>
              </dt>
              <dd className="mb-2 text-fg/85 sm:mb-0">{action}</dd>
            </div>
          ))}
        </dl>
      </Card>

      <Card title="The algorithms at a glance">
        <div className="-mx-4 overflow-x-auto px-4">
          <table className="w-full min-w-[32rem] text-left text-sm">
            <thead className="text-muted">
              <tr className="border-b border-border">
                <th scope="col" className="py-2 pr-4 font-medium">
                  Algorithm
                </th>
                <th scope="col" className="py-2 pr-4 font-medium">
                  Explores with
                </th>
                <th scope="col" className="py-2 pr-4 font-medium">
                  Heuristic
                </th>
                <th scope="col" className="py-2 font-medium">
                  Shortest path
                </th>
              </tr>
            </thead>
            <tbody>
              {ALGORITHMS.map(({ id, name }) => {
                const info = ALGORITHM_INFO[id];
                return (
                  <tr key={id} className="border-b border-border last:border-0">
                    <th scope="row" className="py-2 pr-4 font-normal">
                      <a href={routeToHash({ page: 'learn', algorithmId: id })} className={LINK}>
                        {name}
                      </a>
                    </th>
                    <td className="py-2 pr-4 text-fg/85">{info.structure}</td>
                    <td className="py-2 pr-4 text-fg/85">{info.usesHeuristic ? 'Yes' : 'No'}</td>
                    <td className="py-2 text-fg/85">
                      {info.complexity.optimal ? 'Yes' : 'Not guaranteed'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <Card title="Credits">
        <ul className="flex flex-col gap-2 text-sm leading-relaxed text-fg/85">
          <li>Built by Brad Smith.</li>
          <li>
            Open source under the{' '}
            <a href={LICENSE_URL} target="_blank" rel="noopener noreferrer" className={LINK}>
              MIT License<span className="sr-only"> (opens in a new tab)</span>
            </a>
            . Source code on{' '}
            <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className={LINK}>
              GitHub<span className="sr-only"> (opens in a new tab)</span>
            </a>
            .
          </li>
          <li>Built with React, TypeScript, Vite and Tailwind CSS.</li>
        </ul>
      </Card>
    </div>
  );
}
