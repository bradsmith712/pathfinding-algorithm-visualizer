# CLAUDE.md

## Project

Pathfinding Visualizer — an interactive web app to draw a grid maze, run pathfinding algorithms, and watch them animate. Includes a Learn tab that explains each algorithm.
Tagline: "Explore algorithms. See the paths. Understand the logic."

Read `SPEC.md` for requirements and `TASKS.md` for the work plan. Work through tasks in order, one at a time. Check a task off in `TASKS.md` when done.

## Tech stack

- Vite + React + TypeScript (strict mode)
- Tailwind CSS for styling (dark theme default, light theme supported)
- Vitest for unit tests (algorithms must be tested)
- No backend. Static site, deployable to GitHub Pages or Vercel (free).
- Avoid adding dependencies without a clear need. Ask first.

## Commands

- `npm install` — install deps
- `npm run dev` — dev server
- `npm run build` — production build
- `npm run test` — run Vitest
- `npm run lint` — ESLint
- `npm run typecheck` — `tsc --noEmit`

Run `typecheck`, `lint`, and `test` before saying a task is done.

## Architecture rules

- **Algorithms are pure and UI-free.** Each lives in `src/algorithms/<name>.ts` and is a generator function that yields step events (see SPEC.md "Algorithm interface"). No React, no DOM, no timers inside algorithms.
- The animation player (`src/hooks/useAnimation.ts`) consumes the step generator and controls speed, pause, step, reset.
- Grid state is a 2D array of cell types, kept in a reducer or store. Don't mutate it directly during animation; keep visited/path overlays separate from walls so Reset can clear them without erasing the maze.
- The Visualize tab and the Learn tab's mini-demo share the same `Grid` component and the same algorithm modules. Do not duplicate algorithm code.
- Algorithm metadata (name, tagline, description, pseudo-code, complexity, use cases, key concepts) lives in one data file: `src/data/algorithms.ts`. The Learn tab renders from it.

## Folder structure

```
src/
  algorithms/      # astar.ts, dijkstra.ts, bfs.ts, dfs.ts, greedy.ts, types.ts, index.ts
  components/      # Grid, Cell, Header, ToolPanel, AlgorithmSelect, Controls, Legend, Stats, InfoCard
  pages/           # VisualizePage, LearnPage, AboutPage
  hooks/           # useAnimation, useGridDrawing, useTheme
  data/            # algorithms.ts (Learn content)
  lib/             # grid helpers, heuristics, neighbors
  styles/
tests/
```

## Code style

- TypeScript, no `any`. Prefer small functional components and hooks.
- Named exports. One component per file.
- Colors come from Tailwind theme tokens / CSS variables defined once (see SPEC.md "Design tokens"). No hard-coded hex values in components.
- Keep components accessible: buttons have labels, controls are keyboard reachable, focus states visible.
- Don't leave `console.log` in committed code.

## Behavior notes

- 4-directional movement only (up, down, left, right), uniform cost of 1.
- Heuristic for A* and Greedy: Manhattan distance.
- Tie-breaking must be deterministic (so tests and animations are repeatable).
- If no path exists, show a clear "No path found" state; don't crash or hang.
- Drawing is disabled while an animation is running.

## When unsure

Ask a short clarifying question rather than guessing, especially for UI changes that deviate from the screenshots.
