import type { Theme } from '../hooks/useTheme';
import { routeToHash, type Route } from '../lib/router';
import { Icon } from './Icon';
import { ThemeToggle } from './ThemeToggle';

const NAV_ITEMS: { label: string; page: Route['page'] }[] = [
  { label: 'Visualize', page: 'visualize' },
  { label: 'Learn', page: 'learn' },
  { label: 'About', page: 'about' },
];

interface HeaderProps {
  route: Route;
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
}

export function Header({ route, theme, onThemeChange }: HeaderProps) {
  return (
    <header className="border-b border-border bg-surface">
      <div className="mx-auto flex max-w-[1600px] flex-wrap items-center gap-x-8 gap-y-2 px-4 py-3">
        <a
          href={routeToHash({ page: 'visualize' })}
          className="flex items-center gap-3 rounded-control"
        >
          <Icon name="logo" className="h-9 w-9 shrink-0 text-accent" />
          <span className="flex flex-col">
            <span className="text-lg font-bold leading-tight">Pathfinding Visualizer</span>
            <span className="hidden text-sm text-muted sm:block">
              Explore algorithms. See the paths. Understand the logic.
            </span>
          </span>
        </a>

        <nav
          aria-label="Main"
          className="order-last flex w-full gap-1 md:order-none md:ml-auto md:w-auto"
        >
          {NAV_ITEMS.map(({ label, page }) => {
            const active = route.page === page;
            return (
              <a
                key={page}
                href={routeToHash({ page })}
                aria-current={active ? 'page' : undefined}
                className={`border-b-2 px-3 py-2 text-sm font-medium transition-colors ${
                  active
                    ? 'border-accent text-accent'
                    : 'border-transparent text-muted hover:text-fg'
                }`}
              >
                {label}
              </a>
            );
          })}
        </nav>

        <div className="ml-auto md:ml-0">
          <ThemeToggle theme={theme} onChange={onThemeChange} />
        </div>
      </div>
    </header>
  );
}
