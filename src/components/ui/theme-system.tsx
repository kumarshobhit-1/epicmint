'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

// Theme types
export type Theme = 'light' | 'dark' | 'system';
export type ColorScheme = 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'pink';

interface ThemeConfig {
  theme: Theme;
  colorScheme: ColorScheme;
  reducedMotion: boolean;
  highContrast: boolean;
  fontSize: 'sm' | 'md' | 'lg' | 'xl';
}

interface ThemeContextType {
  config: ThemeConfig;
  actualTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
  setColorScheme: (scheme: ColorScheme) => void;
  toggleReducedMotion: () => void;
  toggleHighContrast: () => void;
  setFontSize: (size: ThemeConfig['fontSize']) => void;
  resetToDefaults: () => void;
}

const defaultConfig: ThemeConfig = {
  theme: 'system',
  colorScheme: 'blue',
  reducedMotion: false,
  highContrast: false,
  fontSize: 'md',
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Theme provider component
interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: Theme;
  defaultColorScheme?: ColorScheme;
  storageKey?: string;
}

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  defaultColorScheme = 'blue',
  storageKey = 'epicmint-theme',
}: ThemeProviderProps) {
  const [config, setConfig] = useState<ThemeConfig>(() => {
    if (typeof window === 'undefined') {
      return { ...defaultConfig, theme: defaultTheme, colorScheme: defaultColorScheme };
    }

    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsedConfig = JSON.parse(stored);
        return { ...defaultConfig, ...parsedConfig };
      }
    } catch (error) {
      console.warn('Failed to parse stored theme config:', error);
    }

    return { ...defaultConfig, theme: defaultTheme, colorScheme: defaultColorScheme };
  });

  const [actualTheme, setActualTheme] = useState<'light' | 'dark'>('light');

  // Update actual theme based on config and system preference
  useEffect(() => {
    if (config.theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      setActualTheme(mediaQuery.matches ? 'dark' : 'light');

      const handleChange = (e: MediaQueryListEvent) => {
        setActualTheme(e.matches ? 'dark' : 'light');
      };

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else {
      setActualTheme(config.theme);
    }
  }, [config.theme]);

  // Apply theme to document
  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove existing theme classes
    root.classList.remove('light', 'dark');
    root.classList.add(actualTheme);

    // Apply color scheme
    root.setAttribute('data-color-scheme', config.colorScheme);

    // Apply accessibility preferences
    if (config.reducedMotion) {
      root.setAttribute('data-reduced-motion', 'true');
    } else {
      root.removeAttribute('data-reduced-motion');
    }

    if (config.highContrast) {
      root.setAttribute('data-high-contrast', 'true');
    } else {
      root.removeAttribute('data-high-contrast');
    }

    // Apply font size
    root.setAttribute('data-font-size', config.fontSize);

    // Store in localStorage
    try {
      localStorage.setItem(storageKey, JSON.stringify(config));
    } catch (error) {
      console.warn('Failed to store theme config:', error);
    }
  }, [config, actualTheme, storageKey]);

  const setTheme = (theme: Theme) => {
    setConfig(prev => ({ ...prev, theme }));
  };

  const setColorScheme = (colorScheme: ColorScheme) => {
    setConfig(prev => ({ ...prev, colorScheme }));
  };

  const toggleReducedMotion = () => {
    setConfig(prev => ({ ...prev, reducedMotion: !prev.reducedMotion }));
  };

  const toggleHighContrast = () => {
    setConfig(prev => ({ ...prev, highContrast: !prev.highContrast }));
  };

  const setFontSize = (fontSize: ThemeConfig['fontSize']) => {
    setConfig(prev => ({ ...prev, fontSize }));
  };

  const resetToDefaults = () => {
    setConfig(defaultConfig);
  };

  const value: ThemeContextType = {
    config,
    actualTheme,
    setTheme,
    setColorScheme,
    toggleReducedMotion,
    toggleHighContrast,
    setFontSize,
    resetToDefaults,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

// Hook to use theme context
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// Theme toggle button component
interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
  variant?: 'button' | 'select';
}

export function ThemeToggle({ className, showLabel = false, variant = 'button' }: ThemeToggleProps) {
  const { config, setTheme } = useTheme();

  if (variant === 'select') {
    return (
      <div className={className}>
        {showLabel && <label className="text-sm font-medium">Theme</label>}
        <select
          value={config.theme}
          onChange={(e) => setTheme(e.target.value as Theme)}
          className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
          <option value="system">System</option>
        </select>
      </div>
    );
  }

  const themeIcons = {
    light: '☀️',
    dark: '🌙',
    system: '💻',
  };

  const nextTheme: Record<Theme, Theme> = {
    light: 'dark',
    dark: 'system',
    system: 'light',
  };

  return (
    <button
      onClick={() => setTheme(nextTheme[config.theme])}
      className={`inline-flex items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring ${className}`}
      title={`Current theme: ${config.theme}. Click to cycle.`}
    >
      <span>{themeIcons[config.theme]}</span>
      {showLabel && <span className="capitalize">{config.theme}</span>}
    </button>
  );
}

// Color scheme selector
interface ColorSchemeSelectorProps {
  className?: string;
  showLabel?: boolean;
}

export function ColorSchemeSelector({ className, showLabel = true }: ColorSchemeSelectorProps) {
  const { config, setColorScheme } = useTheme();

  const colorSchemes: Array<{ value: ColorScheme; label: string; color: string }> = [
    { value: 'blue', label: 'Blue', color: 'bg-blue-500' },
    { value: 'green', label: 'Green', color: 'bg-green-500' },
    { value: 'purple', label: 'Purple', color: 'bg-purple-500' },
    { value: 'orange', label: 'Orange', color: 'bg-orange-500' },
    { value: 'red', label: 'Red', color: 'bg-red-500' },
    { value: 'pink', label: 'Pink', color: 'bg-pink-500' },
  ];

  return (
    <div className={className}>
      {showLabel && <label className="text-sm font-medium mb-2 block">Color Scheme</label>}
      <div className="flex flex-wrap gap-2">
        {colorSchemes.map((scheme) => (
          <button
            key={scheme.value}
            onClick={() => setColorScheme(scheme.value)}
            className={`
              relative w-8 h-8 rounded-full ${scheme.color} border-2 transition-all
              ${config.colorScheme === scheme.value 
                ? 'border-foreground scale-110' 
                : 'border-muted-foreground/30 hover:border-foreground/50'
              }
            `}
            title={scheme.label}
          >
            {config.colorScheme === scheme.value && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full" />
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

// Accessibility preferences component
interface AccessibilityPreferencesProps {
  className?: string;
}

export function AccessibilityPreferences({ className }: AccessibilityPreferencesProps) {
  const { config, toggleReducedMotion, toggleHighContrast, setFontSize } = useTheme();

  return (
    <div className={className}>
      <h3 className="text-sm font-medium mb-3">Accessibility</h3>
      
      <div className="space-y-3">
        {/* Reduced Motion */}
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={config.reducedMotion}
            onChange={toggleReducedMotion}
            className="rounded border border-input"
          />
          <span className="text-sm">Reduce motion</span>
        </label>

        {/* High Contrast */}
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={config.highContrast}
            onChange={toggleHighContrast}
            className="rounded border border-input"
          />
          <span className="text-sm">High contrast</span>
        </label>

        {/* Font Size */}
        <div>
          <label className="text-sm font-medium block mb-1">Font Size</label>
          <select
            value={config.fontSize}
            onChange={(e) => setFontSize(e.target.value as ThemeConfig['fontSize'])}
            className="w-full rounded-md border border-input bg-background px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="sm">Small</option>
            <option value="md">Medium</option>
            <option value="lg">Large</option>
            <option value="xl">Extra Large</option>
          </select>
        </div>
      </div>
    </div>
  );
}

// Complete theme settings panel
interface ThemeSettingsPanelProps {
  className?: string;
  onClose?: () => void;
}

export function ThemeSettingsPanel({ className, onClose }: ThemeSettingsPanelProps) {
  const { resetToDefaults } = useTheme();

  return (
    <div className={`bg-background border rounded-lg p-6 shadow-lg ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Theme Settings</h2>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1 rounded-md hover:bg-accent"
            aria-label="Close"
          >
            ✕
          </button>
        )}
      </div>

      <div className="space-y-6">
        {/* Theme Selection */}
        <ThemeToggle variant="select" showLabel />

        {/* Color Scheme */}
        <ColorSchemeSelector />

        {/* Accessibility */}
        <AccessibilityPreferences />

        {/* Reset Button */}
        <div className="pt-4 border-t">
          <button
            onClick={resetToDefaults}
            className="w-full px-4 py-2 text-sm bg-muted hover:bg-muted/80 rounded-md transition-colors"
          >
            Reset to Defaults
          </button>
        </div>
      </div>
    </div>
  );
}

// Hook for detecting user preferences
export function useUserPreferences() {
  const [preferences, setPreferences] = useState({
    prefersReducedMotion: false,
    prefersHighContrast: false,
    prefersDarkMode: false,
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const updatePreferences = () => {
      setPreferences({
        prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
        prefersHighContrast: window.matchMedia('(prefers-contrast: high)').matches,
        prefersDarkMode: window.matchMedia('(prefers-color-scheme: dark)').matches,
      });
    };

    updatePreferences();

    const mediaQueries = [
      window.matchMedia('(prefers-reduced-motion: reduce)'),
      window.matchMedia('(prefers-contrast: high)'),
      window.matchMedia('(prefers-color-scheme: dark)'),
    ];

    mediaQueries.forEach(mq => mq.addEventListener('change', updatePreferences));

    return () => {
      mediaQueries.forEach(mq => mq.removeEventListener('change', updatePreferences));
    };
  }, []);

  return preferences;
}