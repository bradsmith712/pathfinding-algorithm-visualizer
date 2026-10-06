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
      className="flex gap-0.5 rounded-[10px] border border-border bg-surface p-1"
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
            className={`flex h-9 w-11 items-center justify-center rounded-[7px] transition-colors ${
              active ? 'bg-surface-raised text-fg shadow-sm' : 'text-muted hover:text-fg'
            }`}
          >
            <Icon name={icon} className="h-5 w-5" />
          </button>
        );
      })}
    </div>
  );
}
