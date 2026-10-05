import type { ReactNode } from 'react';

interface CardProps {
  title: string;
  /** Optional step number shown in a circle before the title (Visualize left column). */
  step?: number;
  description?: string;
  className?: string;
  children?: ReactNode;
}

export function Card({ title, step, description, className = '', children }: CardProps) {
  return (
    <section className={`rounded-card border border-border bg-surface p-4 ${className}`}>
      <h2 className="flex items-center gap-2 text-base font-semibold">
        {step !== undefined && (
          <span
            aria-hidden="true"
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-bold text-accent-fg"
          >
            {step}
          </span>
        )}
        {title}
      </h2>
      {description && <p className="mt-1 text-sm text-muted">{description}</p>}
      {children && <div className="mt-3">{children}</div>}
    </section>
  );
}
