import { Card } from './Card';

export function InfoCard() {
  return (
    <Card icon="info" title="Info">
      <p className="text-sm leading-relaxed text-fg/85">
        Click on the grid to place a start node, end node, or draw walls. Then choose an algorithm
        and press Start!
      </p>
      <hr className="my-4 border-border" />
      <blockquote className="px-2 text-center text-sm italic leading-relaxed text-muted">
        “Sometimes the shortest path isn't a straight line, but a smarter one.”
      </blockquote>
    </Card>
  );
}
