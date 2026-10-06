/** Element ids linking the Learn demo's step tabs to their panel (ARIA tabs pattern). */
export const DEMO_PANEL_ID = 'demo-step-panel';

export function demoTabId(index: number): string {
  return `demo-step-tab-${index}`;
}
