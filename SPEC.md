# Pathfinding Visualizer — Spec

## 1. Overview

A single-page web app with three views: **Visualize** (interactive grid), **Learn** (algorithm explanations with a step-through demo), and **About**. Users draw walls, place a start and end node, choose an algorithm, and watch it search. Stats show how the algorithm performed.

Reference UI: two screenshots (Visualize tab, Learn tab). Match their layout and visual style (dark, blue accent, rounded cards).

## 2. Global layout

### Header (all pages)

- Left: logo (blue mountain/peak icon), title "Pathfinding Visualizer", tagline "Explore algorithms. See the paths. Understand the logic."
- Center/right nav: **Visualize**, **Learn**, **About** (on the Learn screenshot the third item is a **GitHub** external link; include both About and a GitHub link, or choose one and note it). Active tab is blue with an underline.
- Far right: light/dark theme toggle (sun / moon segmented button). Default dark. Persist choice in `localStorage`.

## 3. Visualize page

Three-column layout: left control panel, center grid, right info panel. On narrow screens, stack: grid first, then panels.

### 3.1 Left column (numbered cards)

**① Drawing Tools** — "Click or drag on the grid to draw."
Five tool buttons: **Select**, **Wall**, **Start**, **End**, **Erase**. One active at a time (active = blue outline).

- Select: default; no drawing (optionally drag start/end nodes to move them).
- Wall: click/drag paints walls.
- Start / End: click a cell to place (moves the existing one; only one of each).
- Erase: click/drag clears walls.
- Start and End cells can't be overwritten by walls.

**② Choose Algorithm**

- Dropdown with: A* (A Star), Dijkstra's Algorithm, Breadth-First Search (BFS), Depth-First Search (DFS), Greedy Best-First Search.
- Short description under the dropdown that changes with the selection (e.g. "A* uses heuristics to find the shortest path efficiently.").
- "Learn more →" link goes to the Learn page with that algorithm selected.

**③ Controls**

- **Start** (primary, full width): runs the selected algorithm.
- **Pause** / **Resume** (toggles), **Reset**.
- **Reset** clears visited/path overlays and stats but keeps walls, start and end.
- **Speed** slider with a label showing the current setting (Slow / Normal / Fast / Instant).

Also provide a **Clear Walls** action (small secondary button or in the Erase tool) and a **Random Maze** action (nice to have, see TASKS.md).

### 3.2 Center: Grid

- Default about 28 columns × 29 rows (derive from screenshot; make dimensions constants in one place). Square cells with thin grid lines, rounded outer border.
- Cell types: Empty, Wall, Start, End, Visited, Path.
- Default start near the upper left, end near the lower right.
- Click and drag painting must be smooth (use pointer events, handle drag across cells, stop on pointer up even outside the grid).
- Visited cells animate in as the algorithm expands them; then the final path animates from start to end.
- Optional: a slightly darker blue for the most recently visited node (shown in the screenshot near the path start).

### 3.3 Right column

**Legend:** Empty Node, Wall, Start Node (green), End Node (red), Visited Node (blue), Path (cyan).

**Statistics:**

- Nodes Visited (number)
- Path Length (number of steps in the path; show "—" before a run, "No path" if none)
- Execution Time (ms, measured for the algorithm computation itself, not animation time)

**Info card:** helper text — "Click on the grid to place a start node, end node, or draw walls. Then choose an algorithm and press Start!" plus a short quote at the bottom: "Sometimes the shortest path isn't a straight line, but a smarter one."

## 4. Learn page

Layout: left algorithm list, center content, right sidebar of reference cards.

### 4.1 Left: Algorithms list

Title "Algorithms — Click an algorithm to learn more." Cards, each with an icon, name, and one-line subtitle. Selected card is highlighted.

1. **A\* (A Star)** — Heuristic search (recommended)
2. **Dijkstra's Algorithm** — Shortest path (no heuristic)
3. **Breadth-First Search (BFS)** — Shortest path (unweighted)
4. **Depth-First Search (DFS)** — Explores deeply
5. **Greedy Best-First Search** — Heuristic search (faster, not optimal)

### 4.2 Center content (per algorithm)

1. **Title and intro paragraph.**
2. **Three feature cards** (icon, bold title, 1–2 line description). For A*: "Finds optimal path", "More efficient than Dijkstra", "Great for pathfinding". Other algorithms get their own three (e.g. DFS: "Does not guarantee shortest path", "Low memory use", "Good for exploring all paths").
3. **"How <Algorithm> Works" interactive demo**
   - Buttons: **Play**, **Step**, **Reset**.
   - Four step tabs with numbered circles: **Initialize → Explore → Prioritize → Find Path**. The active tab is blue; tabs advance as the demo progresses and are also clickable.
   - Left: small fixed grid (14 columns × 8 rows, matching docs/learn.png) running the real algorithm on a preset maze. Shows a yellow outlined "current" node.
   - Right: step explanation text. For A* the Initialize step shows the formula `f(n) = g(n) + h(n)` and definitions of g(n), h(n), f(n).
   - Legend under the mini grid: Empty, Wall, Start, Goal, Visited, Current, Path.
   - Step tabs map to algorithm phases, so each algorithm provides 4 step descriptions in its data file (for non-heuristic algorithms, "Prioritize" explains queue/stack/priority ordering).
4. **Pseudo-code panel** — line-numbered, syntax-colored, shown in two columns when wide. The line being executed can be highlighted during the demo (nice to have).

### 4.3 Right sidebar cards

- **Key Concepts** (A*: Heuristic, Open Set, Closed Set, each with a short definition; Manhattan distance mentioned.)
- **Time & Space Complexity**: Time, Space, Optimal Path (Yes/No with note), Complete, Typical Performance, plus a "Where:" footnote defining b and d.
- **Use Cases** bullet list (video games, robotics, route planning, maze solving, etc.)

All Learn content comes from `src/data/algorithms.ts`.

## 5. Algorithms

All use a 4-neighbor grid, uniform edge cost of 1, and treat walls as blocked.

| Algorithm         | Structure                   | Optimal                            | Notes                                                                   |
| ----------------- | --------------------------- | ---------------------------------- | ----------------------------------------------------------------------- |
| A*                | Priority queue by f = g + h | Yes (Manhattan is admissible here) | Tie-break on lower h, then insertion order                              |
| Dijkstra          | Priority queue by g         | Yes                                | Behaves like BFS on uniform cost; still implement with a priority queue |
| BFS               | FIFO queue                  | Yes (unweighted)                   |                                                                         |
| DFS               | Stack                       | No                                 | Neighbor order fixed (up, right, down, left)                            |
| Greedy Best-First | Priority queue by h         | No                                 | Fast, can return long paths                                             |

Neighbor order must be consistent: **up, right, down, left**.

### Algorithm interface

```ts
type Pos = { row: number; col: number };

type StepEvent =
  | { type: 'visit'; node: Pos } // node expanded/closed
  | { type: 'frontier'; node: Pos } // node added to open set (optional visual)
  | { type: 'path'; nodes: Pos[] } // final path, start to end
  | { type: 'done'; found: boolean; visited: number; pathLength: number };

interface AlgorithmInput {
  grid: CellType[][];
  start: Pos;
  end: Pos;
}

type Algorithm = (input: AlgorithmInput) => Generator<StepEvent, void, void>;
```

The animation player pulls events from the generator at the chosen speed. "Instant" drains the generator in one go.

## 6. Interaction details

- **Animation states:** idle → running → paused → finished. Controls enable/disable accordingly. Drawing is locked while running or paused.
- **Changing algorithm** while idle just updates the description. After a finished run, changing algorithm or editing the grid clears the overlay.
- **Speed settings:** Slow, Normal, Fast, Instant (slider with 4 stops, default Normal).
- **Edge cases:** start equals end, start or end enclosed by walls, no path, grid with no walls, and re-running after a finish.

## 7. Design tokens

Dark theme (default), based on the screenshots:

- Background: very dark navy (about #0b1220). Cards: slightly lighter navy with subtle border and rounded corners (about 12px).
- Accent blue: about #1e90ff (active tab, primary button).
- Cell colors: Empty = transparent with faint grid line; Wall = slate gray; Start = green; End = red; Visited = blue; Path = bright cyan.
- **Consistency note:** the Learn screenshot uses indigo for Visited and blue for Path, while the Visualize screenshot uses blue for Visited and cyan for Path. Use the Visualize palette everywhere so legends match across pages.
- Light theme: define a matching set of tokens; same hues, light backgrounds.
- Define all colors as CSS variables / Tailwind theme extensions once.

## 8. Non-functional

- Smooth animation on a ~28×29 grid (use CSS class changes or a canvas; avoid re-rendering the full grid per frame; memoize cells).
- Responsive down to tablet; usable on mobile with touch drawing (pointer events).
- Accessible: semantic buttons, labeled controls, visible focus, sufficient contrast, `prefers-reduced-motion` respected (reduce animation to instant).
- Algorithm unit tests cover: shortest path length on known grids, no-path case, start equals end, determinism, and DFS/Greedy returning a valid (not necessarily optimal) path.

## 9. Out of scope (v1)

Weighted nodes, diagonal movement, bidirectional search, user accounts, backend, saving mazes to a server.
