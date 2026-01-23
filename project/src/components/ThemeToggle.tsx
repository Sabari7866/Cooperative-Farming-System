import React from 'react';
import Icon from './Icon';

const THEME_KEY = 'theme';

export function useTheme() {
  const [theme, setTheme] = React.useState<'light' | 'dark'>(() => {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === 'dark' || stored === 'light') return stored;
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)
      return 'dark';
    return 'light';
  });

  React.useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  const toggle = React.useCallback(() => setTheme((t) => (t === 'dark' ? 'light' : 'dark')), []);
  return { theme, setTheme, toggle };
}

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();

  return (
    <button
      aria-label="Toggle theme"
      onClick={toggle}
      className="flex items-center space-x-2 px-3 py-1 border rounded text-sm text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
    >
      {theme === 'dark' ? (
        <>
          <Icon name="Moon" className="h-4 w-4 text-gray-200" />
          <span className="text-gray-200">Dark</span>
        </>
      ) : (
        <>
          <Icon name="Sun" className="h-4 w-4 text-yellow-500" />
          <span>Light</span>
        </>
      )}
    </button>
  );
}
