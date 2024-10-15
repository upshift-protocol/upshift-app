import type { IChildren, ITheme } from '@/utils/types';
import React, { createContext, useState, useContext, useEffect } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider as MuiProvider } from '@mui/material/styles';
import * as mui from '@/config/mui-theme';
import { ToastContainer } from 'react-toastify';
import toastifyConfig from '@/config/toastify';

interface ThemeContextValue {
  theme: ITheme;
  toggleTheme: () => void;
  isDark: boolean;
}

const LOCAL_KEY = 'theme-color';

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const ThemeProvider = ({ children }: IChildren) => {
  const [theme, setTheme] = useState<ITheme>('dark');

  const toggleTheme = () => {
    setTheme((prevTheme) => {
      const other = prevTheme === 'light' ? 'dark' : 'light';
      localStorage.setItem(LOCAL_KEY, other);
      return other;
    });
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const prefersDark = darkModeQuery.matches ? 'dark' : 'light';
      const localStorageTheme = localStorage.getItem(
        LOCAL_KEY,
      ) as ITheme | null;
      setTheme(localStorageTheme ?? prefersDark);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('theme-color', theme);
  }, [theme]);

  const isDark = theme === 'dark';

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDark }}>
      <MuiProvider theme={isDark ? mui.darkTheme : mui.lightTheme}>
        <CssBaseline />
        {children}
      </MuiProvider>

      <ToastContainer {...toastifyConfig} theme={isDark ? 'dark' : 'light'} />
    </ThemeContext.Provider>
  );
};

const useThemeMode = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export { ThemeProvider, useThemeMode };
