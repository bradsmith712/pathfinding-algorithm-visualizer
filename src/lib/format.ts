/** Execution time for the Statistics card: one decimal under 10 ms, whole ms above. */
export function formatDuration(ms: number): string {
  if (ms < 10) return `${ms.toFixed(1)} ms`;
  return `${Math.round(ms)} ms`;
}
