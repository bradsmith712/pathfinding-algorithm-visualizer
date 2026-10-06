import type { ReactNode } from 'react';

export type IconName =
  | 'logo'
  | 'sun'
  | 'moon'
  | 'select'
  | 'wall'
  | 'start'
  | 'end'
  | 'erase'
  | 'trash'
  | 'play'
  | 'pause'
  | 'reset'
  | 'chevron-down'
  | 'arrow-right'
  | 'layers'
  | 'chart'
  | 'info'
  | 'star'
  | 'network'
  | 'blocks'
  | 'branch'
  | 'send'
  | 'check'
  | 'zap'
  | 'target'
  | 'alert'
  | 'cpu'
  | 'list'
  | 'rings'
  | 'bulb'
  | 'step'
  | 'external';

const PATHS: Record<IconName, ReactNode> = {
  logo: (
    <>
      <path d="M1.5 21 9 6.5l4.2 7.6 2.8-4.1 6.5 11Z" fill="currentColor" stroke="none" />
      <path d="M9 6.5 6.6 11.2l1.6-.9 1.3 1.4 1.4-1.6Z" className="fill-fg/80" stroke="none" />
    </>
  ),
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </>
  ),
  moon: <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" fill="currentColor" stroke="none" />,
  select: (
    <path d="M5 3v16.5l4.6-4.4 3 6.4 2.6-1.2-3-6.3H18Z" fill="currentColor" strokeWidth={1} />
  ),
  wall: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <rect x="8.5" y="8.5" width="7" height="7" rx="0.5" fill="currentColor" stroke="none" />
    </>
  ),
  start: <circle cx="12" cy="12" r="9" fill="currentColor" stroke="none" />,
  end: <circle cx="12" cy="12" r="9" fill="currentColor" stroke="none" />,
  erase: (
    <path d="m7 21-4.3-4.3a1 1 0 0 1 0-1.4l10-10a1 1 0 0 1 1.4 0l5.6 5.6a1 1 0 0 1 0 1.4L13 21M22 21H7M5 11l9 9" />
  ),
  trash: <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6M10 11v6M14 11v6" />,
  play: <path d="M7 4.5v15l12-7.5Z" fill="currentColor" stroke="none" />,
  pause: (
    <>
      <rect x="6" y="4.5" width="4" height="15" rx="1" fill="currentColor" stroke="none" />
      <rect x="14" y="4.5" width="4" height="15" rx="1" fill="currentColor" stroke="none" />
    </>
  ),
  reset: <path d="M3 12a9 9 0 1 0 3-6.7L3 8M3 3v5h5" />,
  'chevron-down': <path d="m6 9 6 6 6-6" />,
  'arrow-right': <path d="M5 12h14M13 6l6 6-6 6" />,
  layers: <path d="m12 2 10 5-10 5L2 7Zm-10 10 10 5 10-5M2 17l10 5 10-5" strokeLinejoin="round" />,
  chart: (
    <>
      <rect x="4" y="12" width="4" height="8" rx="1" fill="currentColor" stroke="none" />
      <rect x="10" y="4" width="4" height="16" rx="1" fill="currentColor" stroke="none" />
      <rect x="16" y="9" width="4" height="11" rx="1" fill="currentColor" stroke="none" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="10" fill="currentColor" stroke="none" />
      <path d="M12 11v6M12 7.5v.01" className="stroke-bg" strokeWidth={2.5} />
    </>
  ),
  star: (
    <path
      d="M12 2.5 14.9 8.5l6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5-4.8-4.6 6.6-.9Z"
      fill="currentColor"
      strokeWidth={1}
    />
  ),
  network: (
    <>
      <path d="M10.8 7.4 6.4 15.6M13.2 7.4l4.4 8.2M7.6 18.5h8.8" />
      <circle cx="12" cy="5" r="2.6" fill="currentColor" stroke="none" />
      <circle cx="5" cy="18.5" r="2.6" fill="currentColor" stroke="none" />
      <circle cx="19" cy="18.5" r="2.6" fill="currentColor" stroke="none" />
    </>
  ),
  blocks: (
    <>
      <rect x="3" y="3" width="7" height="7" rx="1.5" fill="currentColor" stroke="none" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" fill="currentColor" stroke="none" />
    </>
  ),
  branch: (
    <>
      <path d="M6 7v10M18 9a9 9 0 0 1-9 9" />
      <circle cx="6" cy="5" r="2.5" fill="currentColor" stroke="none" />
      <circle cx="6" cy="19" r="2.5" fill="currentColor" stroke="none" />
      <circle cx="18" cy="6.5" r="2.5" fill="currentColor" stroke="none" />
    </>
  ),
  send: <path d="M21.5 2.5 2.5 10l8 3.5 3.5 8Zm0 0-11 11" fill="currentColor" strokeWidth={1.5} />,
  check: <path d="m5 12.5 4.5 4.5L19 7.5" strokeWidth={2.5} />,
  zap: <path d="M13 2 3 14h9l-1 8 10-12h-9Z" fill="currentColor" strokeWidth={1} />,
  target: (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />
    </>
  ),
  alert: <path d="M12 3 2 20.5h20ZM12 10v4.5M12 17.5v.01" />,
  cpu: (
    <>
      <rect x="6" y="6" width="12" height="12" rx="2" />
      <path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3" />
    </>
  ),
  list: <path d="M8 6h13M8 12h13M8 18h13M3.5 6h.01M3.5 12h.01M3.5 18h.01" strokeWidth={2.5} />,
  rings: (
    <>
      <circle cx="12" cy="12" r="2" fill="currentColor" stroke="none" />
      <path d="M7.8 7.8a6 6 0 0 0 0 8.4M16.2 7.8a6 6 0 0 1 0 8.4M4.9 4.9a10 10 0 0 0 0 14.2M19.1 4.9a10 10 0 0 1 0 14.2" />
    </>
  ),
  bulb: (
    <>
      <path
        d="M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.2 1 2V17h6v-.3c0-.8.4-1.5 1-2A7 7 0 0 0 12 2Z"
        fill="currentColor"
        stroke="none"
      />
      <path d="M9.5 20h5M10.5 22.5h3" />
    </>
  ),
  step: (
    <>
      <path d="M5 4.5v15l10-7.5Z" fill="currentColor" stroke="none" />
      <rect x="16.5" y="4.5" width="3" height="15" rx="1" fill="currentColor" stroke="none" />
    </>
  ),
  external: (
    <path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
  ),
};

interface IconProps {
  name: IconName;
  className?: string;
}

/** Inline SVG icon drawn with `currentColor`. Decorative: pair it with visible text or an aria-label. */
export function Icon({ name, className = 'h-5 w-5' }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      {PATHS[name]}
    </svg>
  );
}
