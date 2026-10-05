/**
 * Binary min-heap. `compare` returns a negative number when `a` should come
 * out before `b`. Ties are broken by insertion order, so results are
 * deterministic regardless of heap layout.
 */
export class PriorityQueue<T> {
  private heap: { item: T; seq: number }[] = [];
  private nextSeq = 0;

  constructor(private readonly compare: (a: T, b: T) => number) {}

  get size(): number {
    return this.heap.length;
  }

  isEmpty(): boolean {
    return this.heap.length === 0;
  }

  push(item: T): void {
    this.heap.push({ item, seq: this.nextSeq++ });
    this.siftUp(this.heap.length - 1);
  }

  pop(): T | undefined {
    const top = this.heap[0];
    const last = this.heap.pop();
    if (top === undefined || last === undefined) return undefined;
    if (this.heap.length > 0) {
      this.heap[0] = last;
      this.siftDown(0);
    }
    return top.item;
  }

  private less(i: number, j: number): boolean {
    const a = this.heap[i]!;
    const b = this.heap[j]!;
    const c = this.compare(a.item, b.item);
    return c !== 0 ? c < 0 : a.seq < b.seq;
  }

  private swap(i: number, j: number): void {
    const tmp = this.heap[i]!;
    this.heap[i] = this.heap[j]!;
    this.heap[j] = tmp;
  }

  private siftUp(i: number): void {
    while (i > 0) {
      const parent = (i - 1) >> 1;
      if (!this.less(i, parent)) break;
      this.swap(i, parent);
      i = parent;
    }
  }

  private siftDown(i: number): void {
    const n = this.heap.length;
    for (;;) {
      const left = 2 * i + 1;
      const right = left + 1;
      let smallest = i;
      if (left < n && this.less(left, smallest)) smallest = left;
      if (right < n && this.less(right, smallest)) smallest = right;
      if (smallest === i) break;
      this.swap(i, smallest);
      i = smallest;
    }
  }
}
