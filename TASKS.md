# TASKS.md

Work in order. Check off each task when done. Run `typecheck`, `lint`, and `test` before checking off. See `SPEC.md` for details.

## Phase 0 — Setup

- [x] 0.1 Scaffold Vite + React + TypeScript project; enable strict mode
- [x] 0.2 Add Tailwind CSS; define theme tokens (colors, radii) as CSS variables for dark and light themes
- [x] 0.3 Add Vitest, ESLint, Prettier; add `typecheck`, `lint`, `test` scripts
- [x] 0.4 Create folder structure from CLAUDE.md
- [x] 0.5 Add client-side routing (Visualize, Learn, About) with a simple router

## Phase 1 — Algorithms (no UI)

- [x] 1.1 Define types in `algorithms/types.ts` (Pos, CellType, StepEvent, Algorithm)
- [x] 1.2 Grid helpers in `lib/`: neighbors (up, right, down, left), bounds check, Manhattan distance, path reconstruction
- [x] 1.3 Implement BFS generator + tests
- [x] 1.4 Implement DFS generator + tests
- [x] 1.5 Implement Dijkstra generator (with a small binary-heap priority queue) + tests
- [x] 1.6 Implement A* generator + tests (compare path length to Dijkstra on several grids)
- [x] 1.7 Implement Greedy Best-First generator + tests
- [x] 1.8 `algorithms/index.ts` registry (id, display name, function)
- [x] 1.9 Edge-case tests: no path, start equals end, start/end enclosed, empty grid, determinism

## Phase 2 — Shell and theming

- [x] 2.1 Header: logo, title, tagline, nav tabs with active underline
- [x] 2.2 Theme toggle (sun/moon) with persistence; default dark
- [x] 2.3 Page layout containers matching screenshots (3-column Visualize, sidebar Learn)

## Phase 3 — Grid and drawing

- [x] 3.1 Grid state (reducer/store): cells, start, end, grid size constants
- [x] 3.2 `Grid` and memoized `Cell` components with grid lines and rounded border
- [x] 3.3 Pointer-based click and drag drawing (Wall, Erase) with global pointer-up handling
- [x] 3.4 Start and End placement tools (single instance each, can't be overwritten)
- [x] 3.5 Tool panel UI (Select, Wall, Start, End, Erase) with active state
- [x] 3.6 Default start/end positions; Clear Walls button
- [x] 3.7 Touch support check on mobile viewport

## Phase 4 — Visualize page

- [x] 4.1 Algorithm dropdown with per-algorithm short description and "Learn more →" link
- [x] 4.2 Animation hook: consumes generator; states idle/running/paused/finished
- [x] 4.3 Visited-cell animation, then path animation
- [x] 4.4 Controls: Start, Pause/Resume, Reset
- [x] 4.5 Speed slider (Slow, Normal, Fast, Instant) with label
- [x] 4.6 Lock drawing while running/paused; clear overlay on edit after finish
- [x] 4.7 Legend card
- [x] 4.8 Statistics card (nodes visited, path length, execution time via `performance.now()`); "No path found" state
- [x] 4.9 Info card with helper text and quote
- [x] 4.10 Respect `prefers-reduced-motion`

## Phase 5 — Learn page

- [ ] 5.1 Write `data/algorithms.ts`: for all 5 algorithms — name, subtitle, intro, 3 feature cards, 4 step descriptions, pseudo-code, key concepts, complexity table, use cases
- [ ] 5.2 Algorithm list sidebar with selection state and icons
- [ ] 5.3 Intro + feature cards section
- [ ] 5.4 Mini-demo grid with preset maze, reusing `Grid` and the real algorithm
- [ ] 5.5 Play / Step / Reset for the demo; step tabs (Initialize, Explore, Prioritize, Find Path) that track progress and are clickable
- [ ] 5.6 Step explanation panel (incl. `f(n) = g(n) + h(n)` for A*) and demo legend
- [ ] 5.7 Pseudo-code panel with line numbers, syntax colors, two-column layout
- [ ] 5.8 Right sidebar: Key Concepts, Time & Space Complexity, Use Cases
- [ ] 5.9 Deep link from Visualize "Learn more" to the selected algorithm (e.g. `/learn/astar`)

## Phase 6 — Polish

- [ ] 6.1 About page (short description, how to use, credits)
- [ ] 6.2 Light theme pass on every component
- [ ] 6.3 Responsive layouts (tablet, mobile stacking)
- [ ] 6.4 Accessibility pass: labels, focus states, keyboard access, contrast
- [ ] 6.5 Performance check on animation; fix unnecessary re-renders
- [ ] 6.6 Visual comparison against screenshots; fix spacing/color mismatches

## Phase 7 — Ship

- [ ] 7.1 README with screenshots, features, run instructions
- [ ] 7.2 Configure free hosting (GitHub Pages or Vercel) and deploy
- [ ] 7.3 Add live link to README

## Stretch (after v1)

- [ ] S.1 Random maze generator (recursive division)
- [ ] S.2 Drag start/end nodes with the Select tool
- [ ] S.3 Side-by-side algorithm comparison run
- [ ] S.4 Weighted nodes (Dijkstra and A* only)
- [ ] S.5 Diagonal movement option
- [ ] S.6 Highlight current pseudo-code line during demo
