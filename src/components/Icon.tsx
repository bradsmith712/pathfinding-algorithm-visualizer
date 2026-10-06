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
  | 'info';

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
