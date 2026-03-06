import { useState, useEffect, useCallback } from 'react';
import { LS } from '@/lib/storage';

export type ThemeName = 'dark' | 'light' | 'midnight';

export interface ThemeTokens {
  bg: string;
  panel: string;
  card: string;
  border: string;
  text: string;
  sub: string;
  muted: string;
  input: string;
}

const themes: Record<ThemeName, ThemeTokens> = {
  dark: {
    bg: '#121212',
    panel: '#181818',
    card: '#1a1a1a',
    border: '#242424',
    text: '#f0f0f0',
    sub: '#9ca3af',
    muted: '#555',
    input: '#0f0f0f',
  },
  light: {
    bg: '#f4f4f5',
    panel: '#ffffff',
    card: '#ffffff',
    border: '#e4e4e7',
    text: '#09090b',
    sub: '#71717a',
    muted: '#a1a1aa',
    input: '#ebebeb',
  },
  midnight: {
    bg: '#07070f',
    panel: '#0d0d18',
    card: '#10101c',
    border: '#1c1c2e',
    text: '#e2e2ff',
    sub: '#8b8baa',
    muted: '#3d3d5c',
    input: '#080812',
  },
};

export const useUvixTheme = () => {
  const [themeName, setThemeNameState] = useState<ThemeName>(() => LS.get('uvix-theme', 'dark') as ThemeName);

  const setThemeName = useCallback((name: ThemeName) => {
    setThemeNameState(name);
    LS.set('uvix-theme', name);
  }, []);

  const t = themes[themeName];

  // Apply CSS vars to document
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--uvix-bg', t.bg);
    root.style.setProperty('--uvix-panel', t.panel);
    root.style.setProperty('--uvix-card', t.card);
    root.style.setProperty('--uvix-border', t.border);
    root.style.setProperty('--uvix-text', t.text);
    root.style.setProperty('--uvix-sub', t.sub);
    root.style.setProperty('--uvix-muted', t.muted);
    root.style.setProperty('--uvix-input', t.input);
  }, [t]);

  return { themeName, setThemeName, t };
};
