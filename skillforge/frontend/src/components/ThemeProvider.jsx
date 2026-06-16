import { useEffect } from 'react';
import { useThemeStore, applyTheme } from '../store/useThemeStore';

export default function ThemeProvider({ children }) {
  const theme = useThemeStore((s) => s.theme);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  return children;
}
