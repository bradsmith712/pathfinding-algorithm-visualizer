import type { Feature } from '../data/algorithms';
import { TONE_SOFT_BG, TONE_TEXT } from '../lib/tones';
import { Icon } from './Icon';

export function FeatureCard({ icon, tone, title, description }: Feature) {
  return (
    <div className="flex gap-3 rounded-card border border-border bg-surface p-3.5">
      <span
        aria-hidden="true"
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${TONE_SOFT_BG[tone]}`}
      >
        <Icon name={icon} className={`h-5 w-5 ${TONE_TEXT[tone]}`} />
      </span>
      <div className="min-w-0">
        <h3 className="text-[13px] font-semibold leading-snug">{title}</h3>
        <p className="mt-1 text-[13px] leading-snug text-muted">{description}</p>
      </div>
    </div>
  );
}
