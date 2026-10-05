import type { ReactNode } from 'react';

export type IconName =
  'logo' | 'sun' | 'moon' | 'select' | 'wall' | 'start' | 'end' | 'erase' | 'trash';

const PATHS: Record<IconName, ReactNode> = {
  logo: (
    <>
      <path d="M2 20 9 8l4 6 3-4 6 10Z" fill="currentColor" stroke="none" />
      <path d="m7.5 10.5 1.5-2.5 1.5 2.3" className="stroke-bg" />
    </>
  ),
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </>
  ),
  moon: <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />,
  select: <path d="m4 4 7 17 2.5-7.5L21 11Z" />,
  wall: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="1" />
      <path d="M3 9.33h18M3 14.67h18M9 4v5.33M15 9.33v5.34M9 14.67V20" />
    </>
  ),
  start: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m10 8 6 4-6 4Z" fill="currentColor" />
    </>
  ),
  end: (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1" fill="currentColor" />
    </>
  ),
  erase: (
    <path d="m7 21-4.3-4.3a1 1 0 0 1 0-1.4l10-10a1 1 0 0 1 1.4 0l5.6 5.6a1 1 0 0 1 0 1.4L13 21M22 21H7M5 11l9 9" />
  ),
  trash: <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6M10 11v6M14 11v6" />,
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
