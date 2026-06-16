import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { applyTheme } from './store/useThemeStore';

const savedTheme = localStorage.getItem('skillforge-theme');
if (savedTheme) {
  try {
    const parsed = JSON.parse(savedTheme);
    applyTheme(parsed?.state?.theme || 'dark');
  } catch {
    applyTheme('dark');
  }
} else {
  applyTheme('dark');
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
