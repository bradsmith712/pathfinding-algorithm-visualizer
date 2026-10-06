import type { AlgorithmId } from '../algorithms/types';
import type { IconName } from '../components/Icon';

/** Icon color, mapped to the `tone-*` theme tokens by the components. */
export type Tone = 'blue' | 'green' | 'yellow' | 'red' | 'violet';

export interface Feature {
  icon: IconName;
  tone: Tone;
  title: string;
  description: string;
}

export interface Term {
  term: string;
  definition: string;
}

/** One of the four demo phases: Initialize, Explore, Prioritize, Find Path. */
export interface DemoStep {
  title: string;
  body: string;
  /** Optional formula shown in a code box (e.g. A*'s f(n) = g(n) + h(n)). */
  formula?: string;
  /** Optional definitions listed under the formula. */
  terms?: Term[];
}

export interface Complexity {
  time: string;
  timeNote?: string;
  space: string;
  spaceNote?: string;
  optimal: boolean;
  optimalNote?: string;
  complete: boolean;
  completeNote?: string;
  performance: string;
  /** "Where:" footnote defining the symbols used above. */
  where: Term[];
}

export interface AlgorithmInfo {
  /** Icon and tone for the Learn list. */
  icon: IconName;
  tone: Tone;
  /** One-line subtitle for the Learn list. */
  subtitle: string;
  /** Short description shown under the Visualize dropdown. */
  summary: string;
  /** Data structure that orders the search (About page comparison table). */
  structure: string;
  usesHeuristic: boolean;
  /** Intro paragraph at the top of the Learn page. */
  intro: string;
  features: [Feature, Feature, Feature];
  steps: [DemoStep, DemoStep, DemoStep, DemoStep];
  pseudoCode: string[];
  keyConcepts: Term[];
  complexity: Complexity;
  useCases: string[];
}

const B = { term: 'b', definition: 'branching factor (number of neighbors)' };
const D = { term: 'd', definition: 'depth of the solution' };
const M = { term: 'm', definition: 'maximum depth of the search' };

export const ALGORITHM_INFO: Record<AlgorithmId, AlgorithmInfo> = {
  astar: {
    icon: 'star',
    tone: 'blue',
    subtitle: 'Heuristic search (recommended)',
    summary: 'A* uses heuristics to find the shortest path efficiently.',
    structure: 'Priority queue by f = g + h',
    usesHeuristic: true,
    intro:
      "A* is an informed search algorithm that finds the shortest path from a start node to a goal node. It combines the benefits of Dijkstra's algorithm (guaranteed optimal path) with a heuristic to prioritize nodes that are closer to the goal, making it much more efficient.",
    features: [
      {
        icon: 'check',
        tone: 'green',
        title: 'Finds optimal path',
        description: 'Guaranteed shortest path (with admissible heuristic)',
      },
      {
        icon: 'zap',
        tone: 'yellow',
        title: 'More efficient than Dijkstra',
        description: 'Uses a heuristic to focus the search',
      },
      {
        icon: 'target',
        tone: 'violet',
        title: 'Great for pathfinding',
        description: 'Commonly used in games, robotics, and mapping',
      },
    ],
    steps: [
      {
        title: 'Initialize',
        body: 'Add the start node to the open set with f = 0. The algorithm will explore the most promising nodes first, using:',
        formula: 'f(n) = g(n) + h(n)',
        terms: [
          { term: 'g(n)', definition: 'Cost from start to node n (actual distance)' },
          {
            term: 'h(n)',
            definition: 'Heuristic estimate from node n to goal (e.g., Manhattan distance)',
          },
          { term: 'f(n)', definition: 'Total estimated cost' },
        ],
      },
      {
        title: 'Explore',
        body: 'Take the node with the lowest f from the open set and move it to the closed set. Look at its neighbors (up, right, down, left), skipping walls and closed nodes. For each one, compute g = g(current) + 1.',
      },
      {
        title: 'Prioritize',
        body: 'If a neighbor is new, or this route to it is cheaper than before, record the current node as its parent and add it to the open set with f = g + h. Ties on f go to the node with the smaller h, which is closer to the goal.',
      },
      {
        title: 'Find Path',
        body: 'When the goal comes out of the open set, the shortest path is known. Follow the parent links back from the goal to the start to rebuild it. If the open set empties first, no path exists.',
      },
    ],
    pseudoCode: [
      'function A*(start, goal):',
      '  openSet = {start}',
      '  cameFrom = {}',
      '  gScore[start] = 0',
      '  fScore[start] = heuristic(start, goal)',
      '',
      '  while openSet is not empty:',
      '    current = node in openSet with lowest fScore',
      '',
      '    if current == goal:',
      '      return reconstructPath(cameFrom, current)',
      '',
      '    openSet.remove(current)',
      '    for each neighbor in getNeighbors(current):',
      '      tentative_gScore = gScore[current] + 1',
      '',
      '      if tentative_gScore < gScore.get(neighbor, ∞):',
      '        cameFrom[neighbor] = current',
      '        gScore[neighbor] = tentative_gScore',
      '        fScore[neighbor] = gScore[neighbor] + heuristic(neighbor, goal)',
      '        if neighbor not in openSet:',
      '          openSet.add(neighbor)',
      '',
      '  return failure',
    ],
    keyConcepts: [
      {
        term: 'Heuristic',
        definition:
          'Estimates the cost from a node to the goal. Common heuristic: Manhattan distance (|x1 - x2| + |y1 - y2|).',
      },
      { term: 'Open Set', definition: 'Nodes to be explored, prioritized by f(n).' },
      { term: 'Closed Set', definition: 'Nodes that have already been evaluated.' },
    ],
    complexity: {
      time: 'O(b^d)',
      timeNote: 'worst case',
      space: 'O(b^d)',
      optimal: true,
      optimalNote: 'with admissible heuristic',
      complete: true,
      performance: 'Fast in practice',
      where: [B, D],
    },
    useCases: [
      'Video games (e.g., NPC movement)',
      'Robotics and autonomous navigation',
      'Route planning (GPS)',
      'Maze solving',
      'Any scenario where you need the shortest path efficiently',
    ],
  },

  dijkstra: {
    icon: 'network',
    tone: 'yellow',
    subtitle: 'Shortest path (no heuristic)',
    summary: "Dijkstra's explores outward by distance and always finds the shortest path.",
    structure: 'Priority queue by distance g',
    usesHeuristic: false,
    intro:
      "Dijkstra's algorithm finds the shortest path by always expanding the closest unexplored node to the start. It has no idea where the goal is, so it spreads out evenly in every direction, but it guarantees the shortest path whenever edge costs are non-negative.",
    features: [
      {
        icon: 'check',
        tone: 'green',
        title: 'Finds optimal path',
        description: 'Guaranteed shortest path with non-negative costs',
      },
      {
        icon: 'rings',
        tone: 'yellow',
        title: 'Explores evenly',
        description: 'Expands in rings of equal distance from the start',
      },
      {
        icon: 'network',
        tone: 'violet',
        title: 'Handles weighted graphs',
        description: 'Works with any non-negative edge costs, not just grids',
      },
    ],
    steps: [
      {
        title: 'Initialize',
        body: 'Set the distance to the start node to 0 and every other node to infinity. Put the start node in a priority queue keyed by distance.',
        formula: 'dist(start) = 0',
        terms: [
          { term: 'dist(n)', definition: 'Shortest known distance from start to node n' },
          { term: 'queue', definition: 'Priority queue ordered by dist (smallest first)' },
        ],
      },
      {
        title: 'Explore',
        body: 'Remove the node with the smallest distance from the queue and mark it visited. Its distance is now final. Look at each neighbor that is not a wall and not yet visited.',
      },
      {
        title: 'Prioritize',
        body: 'Relax each neighbor: if dist(current) + 1 is smaller than its known distance, update it, record current as its parent, and push it onto the priority queue. Equal distances leave the queue in the order they were added.',
      },
      {
        title: 'Find Path',
        body: 'When the goal is removed from the queue its distance is final, so the path is the shortest. Follow parent links back to the start. If the queue empties first, no path exists.',
      },
    ],
    pseudoCode: [
      'function Dijkstra(start, goal):',
      '  dist = {start: 0}',
      '  cameFrom = {}',
      '  queue = PriorityQueue()',
      '  queue.push(start, 0)',
      '',
      '  while queue is not empty:',
      '    current = queue.popMin()',
      '    if current is visited: continue',
      '    mark current as visited',
      '',
      '    if current == goal:',
      '      return reconstructPath(cameFrom, current)',
      '',
      '    for each neighbor in getNeighbors(current):',
      '      alt = dist[current] + 1',
      '      if alt < dist.get(neighbor, ∞):',
      '        dist[neighbor] = alt',
      '        cameFrom[neighbor] = current',
      '        queue.push(neighbor, alt)',
      '',
      '  return failure',
    ],
    keyConcepts: [
      {
        term: 'Distance',
        definition: 'The cost of the best known route from the start to a node.',
      },
      {
        term: 'Priority Queue',
        definition: 'Always hands back the node with the smallest distance next.',
      },
      {
        term: 'Relaxation',
        definition: 'Updating a neighbor when a shorter route to it is found.',
      },
    ],
    complexity: {
      time: 'O(b^d)',
      timeNote: 'uniform cost grid',
      space: 'O(b^d)',
      optimal: true,
      optimalNote: 'non-negative costs',
      complete: true,
      performance: 'Thorough but slower',
      where: [B, D],
    },
    useCases: [
      'Network routing protocols (e.g., OSPF)',
      'Road maps with travel times',
      'Finding all shortest distances from one place',
      'Weighted graphs where no good heuristic exists',
    ],
  },

  bfs: {
    icon: 'blocks',
    tone: 'violet',
    subtitle: 'Shortest path (unweighted)',
    summary: 'BFS explores level by level and finds the shortest path on an unweighted grid.',
    structure: 'Queue (first in, first out)',
    usesHeuristic: false,
    intro:
      'Breadth-First Search explores the grid one layer at a time: first every node one step from the start, then every node two steps away, and so on. Because every move costs the same, the first time it reaches the goal it has found a shortest path.',
    features: [
      {
        icon: 'check',
        tone: 'green',
        title: 'Shortest path',
        description: 'Optimal when every move costs the same',
      },
      {
        icon: 'list',
        tone: 'yellow',
        title: 'Simple FIFO queue',
        description: 'No priorities, just first in, first out',
      },
      {
        icon: 'rings',
        tone: 'violet',
        title: 'Level by level',
        description: 'Explores all nodes at distance k before k + 1',
      },
    ],
    steps: [
      {
        title: 'Initialize',
        body: 'Put the start node in a queue and mark it as discovered. Nothing else has been seen yet.',
        formula: 'queue = [start]',
        terms: [
          {
            term: 'queue',
            definition: 'First in, first out: nodes leave in the order they arrived',
          },
          {
            term: 'discovered',
            definition: 'Nodes already added to the queue, so they are never added twice',
          },
        ],
      },
      {
        title: 'Explore',
        body: 'Take the node at the front of the queue and visit it. Look at its neighbors in a fixed order: up, right, down, left. Skip walls and nodes already discovered.',
      },
      {
        title: 'Prioritize',
        body: 'BFS has no priority: each new neighbor joins the back of the queue with the current node as its parent. That simple ordering is what makes it expand in rings of equal distance.',
      },
      {
        title: 'Find Path',
        body: 'When the goal leaves the queue, follow parent links back to the start. That path is a shortest one. If the queue runs out first, the goal cannot be reached.',
      },
    ],
    pseudoCode: [
      'function BFS(start, goal):',
      '  queue = [start]',
      '  discovered = {start}',
      '  cameFrom = {}',
      '',
      '  while queue is not empty:',
      '    current = queue.dequeue()',
      '',
      '    if current == goal:',
      '      return reconstructPath(cameFrom, current)',
      '',
      '    for each neighbor in getNeighbors(current):',
      '      if neighbor not in discovered:',
      '        discovered.add(neighbor)',
      '        cameFrom[neighbor] = current',
      '        queue.enqueue(neighbor)',
      '',
      '  return failure',
    ],
    keyConcepts: [
      { term: 'Queue (FIFO)', definition: 'The first node added is the first one explored.' },
      {
        term: 'Frontier',
        definition: 'The ring of discovered but unexplored nodes at the edge of the search.',
      },
      { term: 'Discovered Set', definition: 'Prevents the same node from being queued twice.' },
    ],
    complexity: {
      time: 'O(b^d)',
      space: 'O(b^d)',
      optimal: true,
      optimalNote: 'unweighted graphs',
      complete: true,
      performance: 'Predictable, explores widely',
      where: [B, D],
    },
    useCases: [
      'Fewest moves in puzzles and games',
      'Social networks (degrees of separation)',
      'Web crawlers exploring links level by level',
      'Shortest paths on unweighted grids',
    ],
  },

  dfs: {
    icon: 'branch',
    tone: 'green',
    subtitle: 'Explores deeply',
    summary: 'DFS dives down one branch before backtracking. The path it finds can be long.',
    structure: 'Stack (last in, first out)',
    usesHeuristic: false,
    intro:
      'Depth-First Search follows one direction as far as it can before backing up and trying the next. It will find a path if one exists, but it pays no attention to distance, so the path is often long and winding.',
    features: [
      {
        icon: 'alert',
        tone: 'red',
        title: 'Does not guarantee shortest path',
        description: 'Returns the first path it stumbles on',
      },
      {
        icon: 'cpu',
        tone: 'yellow',
        title: 'Low memory use',
        description: 'Only keeps the current branch and its siblings',
      },
      {
        icon: 'branch',
        tone: 'violet',
        title: 'Good for exploring all paths',
        description: 'Natural fit for mazes, backtracking, and puzzles',
      },
    ],
    steps: [
      {
        title: 'Initialize',
        body: 'Push the start node onto a stack. The stack holds the branches still to explore.',
        formula: 'stack = [start]',
        terms: [
          { term: 'stack', definition: 'Last in, first out: the newest node is explored next' },
          { term: 'visited', definition: 'Nodes already explored, so the search never loops' },
        ],
      },
      {
        title: 'Explore',
        body: 'Pop the top node off the stack. If it has been visited, skip it; otherwise mark it visited. Look at its neighbors in the order up, right, down, left, skipping walls and visited nodes.',
      },
      {
        title: 'Prioritize',
        body: 'Push the neighbors onto the stack in reverse order so "up" ends on top and is explored first. The search keeps diving in that direction and only backtracks when it hits a dead end.',
      },
      {
        title: 'Find Path',
        body: 'When the goal is popped, follow parent links back to the start. The path is valid but usually not the shortest. If the stack empties first, there is no path.',
      },
    ],
    pseudoCode: [
      'function DFS(start, goal):',
      '  stack = [start]',
      '  visited = {}',
      '  cameFrom = {}',
      '',
      '  while stack is not empty:',
      '    current = stack.pop()',
      '    if current in visited: continue',
      '    visited.add(current)',
      '',
      '    if current == goal:',
      '      return reconstructPath(cameFrom, current)',
      '',
      '    for each neighbor in reverse(getNeighbors(current)):',
      '      if neighbor not in visited:',
      '        cameFrom[neighbor] = current',
      '        stack.push(neighbor)',
      '',
      '  return failure',
    ],
    keyConcepts: [
      { term: 'Stack (LIFO)', definition: 'The most recently added node is explored first.' },
      {
        term: 'Backtracking',
        definition: 'Returning to an earlier branch when the current one hits a dead end.',
      },
      { term: 'Visited Set', definition: 'Stops the search from going around in circles.' },
    ],
    complexity: {
      time: 'O(b^m)',
      space: 'O(b·m)',
      optimal: false,
      optimalNote: 'first path found',
      complete: true,
      completeNote: 'on finite grids',
      performance: 'Varies a lot with layout',
      where: [B, M],
    },
    useCases: [
      'Maze generation and solving',
      'Detecting cycles in graphs',
      'Topological sorting of tasks',
      'Puzzles with backtracking (e.g., Sudoku)',
    ],
  },

  greedy: {
    icon: 'send',
    tone: 'red',
    subtitle: 'Heuristic search (faster, not optimal)',
    summary: 'Greedy Best-First heads straight for the goal. Fast, but not always the shortest.',
    structure: 'Priority queue by heuristic h',
    usesHeuristic: true,
    intro:
      'Greedy Best-First Search always expands the node that looks closest to the goal, judged only by the heuristic. It ignores how far it has already traveled, so it is often very fast, but it can be lured down dead ends and return a longer path.',
    features: [
      {
        icon: 'zap',
        tone: 'yellow',
        title: 'Very fast',
        description: 'Often visits far fewer nodes than A*',
      },
      {
        icon: 'alert',
        tone: 'red',
        title: 'Not always optimal',
        description: 'Can be fooled by walls between it and the goal',
      },
      {
        icon: 'target',
        tone: 'violet',
        title: 'Goal-directed',
        description: 'Uses only the heuristic h(n) to choose',
      },
    ],
    steps: [
      {
        title: 'Initialize',
        body: 'Put the start node in a priority queue keyed only by its estimated distance to the goal:',
        formula: 'priority(n) = h(n)',
        terms: [
          {
            term: 'h(n)',
            definition: 'Heuristic estimate from node n to goal (Manhattan distance)',
          },
          { term: 'g(n)', definition: 'Ignored: the distance already traveled does not count' },
        ],
      },
      {
        title: 'Explore',
        body: 'Remove the node with the smallest h and visit it. Look at its neighbors (up, right, down, left), skipping walls and nodes already discovered.',
      },
      {
        title: 'Prioritize',
        body: 'Add each new neighbor to the queue with priority h and remember the current node as its parent. The queue always favors whatever looks closest to the goal, even if it took a long detour to get there.',
      },
      {
        title: 'Find Path',
        body: 'When the goal is removed, follow parent links back to the start. The path is valid but may be longer than necessary. If the queue empties first, no path exists.',
      },
    ],
    pseudoCode: [
      'function GreedyBestFirst(start, goal):',
      '  openSet = PriorityQueue()',
      '  openSet.push(start, heuristic(start, goal))',
      '  discovered = {start}',
      '  cameFrom = {}',
      '',
      '  while openSet is not empty:',
      '    current = openSet.popMin()',
      '',
      '    if current == goal:',
      '      return reconstructPath(cameFrom, current)',
      '',
      '    for each neighbor in getNeighbors(current):',
      '      if neighbor not in discovered:',
      '        discovered.add(neighbor)',
      '        cameFrom[neighbor] = current',
      '        openSet.push(neighbor, heuristic(neighbor, goal))',
      '',
      '  return failure',
    ],
    keyConcepts: [
      {
        term: 'Heuristic',
        definition: 'An estimate of the remaining distance. Here: Manhattan distance.',
      },
      {
        term: 'Greedy Choice',
        definition: 'Always taking the option that looks best right now, without looking back.',
      },
      {
        term: 'Open Set',
        definition: 'Discovered nodes waiting to be explored, ordered by h(n).',
      },
    ],
    complexity: {
      time: 'O(b^m)',
      timeNote: 'worst case',
      space: 'O(b^m)',
      optimal: false,
      optimalNote: 'ignores path cost',
      complete: true,
      completeNote: 'on finite grids',
      performance: 'Very fast on open maps',
      where: [B, M],
    },
    useCases: [
      'Quick, good-enough paths in games',
      'Real-time planning when speed beats accuracy',
      'Open maps with few obstacles',
      'A first guess before running a slower optimal search',
    ],
  },
};
