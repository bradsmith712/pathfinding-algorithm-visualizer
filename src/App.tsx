import { useRoute } from './hooks/useRoute';
import { routeToHash, type Route } from './lib/router';
import { AboutPage } from './pages/AboutPage';
import { LearnPage } from './pages/LearnPage';
import { VisualizePage } from './pages/VisualizePage';

const NAV_ITEMS: { label: string; route: Route }[] = [
  { label: 'Visualize', route: { page: 'visualize' } },
  { label: 'Learn', route: { page: 'learn' } },
  { label: 'About', route: { page: 'about' } },
];

// Placeholder navigation; the full Header component is built in Phase 2.
export function App() {
  const route = useRoute();

  return (
    <div className="min-h-screen">
      <nav aria-label="Main" className="flex gap-4 border-b border-border p-4">
        {NAV_ITEMS.map(({ label, route: target }) => {
          const active = target.page === route.page;
          return (
            <a
              key={label}
              href={routeToHash(target)}
              aria-current={active ? 'page' : undefined}
              className={active ? 'font-semibold text-accent' : 'text-muted hover:text-fg'}
            >
              {label}
            </a>
          );
        })}
      </nav>
      <main>
        {route.page === 'visualize' && <VisualizePage />}
        {route.page === 'learn' && <LearnPage algorithmId={route.algorithmId} />}
        {route.page === 'about' && <AboutPage />}
      </main>
    </div>
  );
}
