import type { Theme } from '../hooks/useTheme';
import { Icon } from './Icon';

interface ThemeToggleProps {
  theme: Theme;
  onChange: (theme: Theme) => void;
}

const OPTIONS: { value: Theme; label: string; icon: 'sun' | 'moon' }[] = [
  { value: 'light', label: 'Light theme', icon: 'sun' },
  { value: 'dark', label: 'Dark theme', icon: 'moon' },
];

export function ThemeToggle({ theme, onChange }: ThemeToggleProps) {
  return (
    <div
      role="group"
      aria-label="Color theme"
      className="flex rounded-control border border-border bg-surface-raised p-0.5"
    >
      {OPTIONS.map(({ value, label, icon }) => {
        const active = theme === value;
        return (
          <button
            key={value}
            type="button"
            aria-label={label}
            aria-pressed={active}
            title={label}
            onClick={() => onChange(value)}
            className={`rounded-[6px] p-1.5 transition-colors ${
              active ? 'bg-accent text-accent-fg' : 'text-muted hover:text-fg'
            }`}
          >
            <Icon name={icon} className="h-4 w-4" />
          </button>
        );
      })}
    </div>
  );
}
