
export interface Theme {
  id: string;
  name: string;
  description: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    foreground: string;
    accent: string;
    muted: string;
    border: string;
    success: string;
    error: string;
    warning: string;
  };
  fonts: {
    heading: string;
    body: string;
    mono: string;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
    full: string;
  };
}

export const themes: Record<string, Theme> = {
  default: {
    id: 'default',
    name: 'MagajiCo Default',
    description: 'Original MagajiCo sports theme',
    colors: {
      primary: '#10b981',
      secondary: '#3b82f6',
      background: '#1a1a1a',
      foreground: '#ffffff',
      accent: '#22c55e',
      muted: '#6b7280',
      border: '#374151',
      success: '#22c55e',
      error: '#ef4444',
      warning: '#f59e0b',
    },
    fonts: {
      heading: 'var(--font-inter)',
      body: 'var(--font-inter)',
      mono: 'monospace',
    },
    spacing: {
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem',
    },
    borderRadius: {
      sm: '0.25rem',
      md: '0.5rem',
      lg: '1rem',
      full: '9999px',
    },
  },
  flashscore: {
    id: 'flashscore',
    name: 'FlashScore',
    description: 'Green-themed FlashScore inspired design',
    colors: {
      primary: '#00a651',
      secondary: '#008744',
      background: '#0d1117',
      foreground: '#c9d1d9',
      accent: '#00ff88',
      muted: '#8b949e',
      border: '#30363d',
      success: '#22c55e',
      error: '#f85149',
      warning: '#f0883e',
    },
    fonts: {
      heading: 'var(--font-roboto)',
      body: 'var(--font-roboto)',
      mono: 'monospace',
    },
    spacing: {
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem',
    },
    borderRadius: {
      sm: '0.375rem',
      md: '0.5rem',
      lg: '0.75rem',
      full: '9999px',
    },
  },
  minimal: {
    id: 'minimal',
    name: 'Minimal Light',
    description: 'Clean minimal design with light colors',
    colors: {
      primary: '#000000',
      secondary: '#666666',
      background: '#ffffff',
      foreground: '#000000',
      accent: '#0066cc',
      muted: '#999999',
      border: '#e5e5e5',
      success: '#00cc66',
      error: '#cc0000',
      warning: '#ff9900',
    },
    fonts: {
      heading: 'var(--font-inter)',
      body: 'var(--font-inter)',
      mono: 'monospace',
    },
    spacing: {
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '2rem',
      xl: '3rem',
    },
    borderRadius: {
      sm: '0.125rem',
      md: '0.25rem',
      lg: '0.5rem',
      full: '9999px',
    },
  },
  cyberpunk: {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    description: 'Neon cyberpunk aesthetic',
    colors: {
      primary: '#ff00ff',
      secondary: '#00ffff',
      background: '#0a0a0f',
      foreground: '#e0e0ff',
      accent: '#00ff00',
      muted: '#6a6a8a',
      border: '#2a2a4a',
      success: '#00ff00',
      error: '#ff0066',
      warning: '#ffcc00',
    },
    fonts: {
      heading: 'var(--font-roboto)',
      body: 'var(--font-roboto)',
      mono: 'monospace',
    },
    spacing: {
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem',
    },
    borderRadius: {
      sm: '0rem',
      md: '0.125rem',
      lg: '0.25rem',
      full: '0rem',
    },
  },
};

export function getTheme(themeId: string): Theme {
  return themes[themeId] || themes.default;
}

export function getAvailableThemes(): Theme[] {
  return Object.values(themes);
}
