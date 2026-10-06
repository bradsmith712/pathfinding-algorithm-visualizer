import type { Theme } from '../hooks/useTheme';
import { GITHUB_URL } from '../lib/links';
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
    <header className="border-b border-border bg-bg">
      <div className="mx-auto flex max-w-[1600px] flex-wrap items-center gap-x-4 gap-y-1 lg:gap-x-6 xl:gap-x-10 px-4 py-3 md:px-6 xl:px-4">
        <a
          href={routeToHash({ page: 'visualize' })}
          className="flex items-center gap-3 rounded-control sm:gap-4"
        >
          <Icon name="logo" className="h-9 w-9 shrink-0 text-accent sm:h-11 sm:w-11" />
          <span className="flex flex-col">
            <span className="text-lg font-semibold leading-tight sm:text-2xl">
              Pathfinding Visualizer
            </span>
            <span className="hidden text-sm text-muted sm:block">
              Explore algorithms. See the paths. Understand the logic.
            </span>
          </span>
        </a>

        <nav
          aria-label="Main"
          className="order-last flex w-full gap-1 sm:gap-2 lg:order-none lg:ml-auto lg:w-auto xl:gap-6"
        >
          {NAV_ITEMS.map(({ label, page }) => {
            const active = route.page === page;
            return (
              <a
                key={page}
                href={routeToHash({ page })}
                aria-current={active ? 'page' : undefined}
                className={`relative rounded-control px-3 pb-3 pt-2 text-base font-medium transition-colors ${
                  active ? 'text-accent' : 'text-fg/85 hover:text-fg'
                }`}
              >
                {label}
                {active && (
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-3 bottom-1 h-[3px] rounded-full bg-accent"
                  />
                )}
              </a>
            );
          })}
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-control px-3 pb-3 pt-2 text-base font-medium text-fg/85 transition-colors hover:text-fg"
          >
            GitHub
            <Icon name="external" className="h-4 w-4" />
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        </nav>

        <div className="ml-auto lg:ml-0 xl:ml-[clamp(1rem,6vw,8rem)]">
          <ThemeToggle theme={theme} onChange={onThemeChange} />
        </div>
      </div>
    </header>
  );
}
