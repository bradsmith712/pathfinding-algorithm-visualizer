import type { ReactNode } from 'react';
import { Icon, type IconName } from './Icon';

interface CardProps {
  title: string;
  /** Step number shown in a circle before the title (Visualize left column). */
  step?: number;
  /** Icon shown before the title (Visualize right column). */
  icon?: IconName;
  /** Color for the icon (defaults to the text color). */
  iconClass?: string;
  description?: string;
  className?: string;
  children?: ReactNode;
}

export function Card({
  title,
  step,
  icon,
  iconClass = 'text-fg',
  description,
  className = '',
  children,
}: CardProps) {
  return (
    <section className={`rounded-card border border-border bg-surface p-4 ${className}`}>
      <h2 className="flex items-center gap-3 text-base font-semibold">
        {step !== undefined && (
          <span
            aria-hidden="true"
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-semibold text-bg"
          >
            {step}
          </span>
        )}
        {icon && <Icon name={icon} className={`h-6 w-6 shrink-0 ${iconClass}`} />}
        {title}
      </h2>
      {description && <p className="mt-2 text-sm text-muted">{description}</p>}
      {children && <div className="mt-3">{children}</div>}
    </section>
  );
}
