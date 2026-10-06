import { useEffect } from 'react';
import { Header } from './components/Header';
import { useRoute } from './hooks/useRoute';
import { useTheme } from './hooks/useTheme';
import { AboutPage } from './pages/AboutPage';
import { LearnPage } from './pages/LearnPage';
import { VisualizePage } from './pages/VisualizePage';

export function App() {
  const route = useRoute();
  const [theme, setTheme] = useTheme();

  // Hash navigation keeps the scroll position; start each page at the top.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [route.page]);

  return (
    <div className="min-h-screen">
      <Header route={route} theme={theme} onThemeChange={setTheme} />
      <main>
        {route.page === 'visualize' && <VisualizePage />}
        {route.page === 'learn' && <LearnPage algorithmId={route.algorithmId} />}
        {route.page === 'about' && <AboutPage />}
      </main>
    </div>
  );
}
