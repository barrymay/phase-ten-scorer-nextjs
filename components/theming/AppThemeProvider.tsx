import { ThemeProvider, useTheme } from '@emotion/react';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { AppTheme, darkTheme, lightTheme } from './themes';
interface IThemeState {
  themeMode: 'dark' | 'light';
}

const ThemeStateContext = React.createContext<IThemeState | undefined>(
  undefined,
);
const ThemeDispatchContext = React.createContext<(() => void) | undefined>(
  undefined,
);

const AppThemeProvider: React.FC = (props) => {
  const [theme, setTheme] = useState<IThemeState | undefined>(undefined);

  function setToLight() {
    document.documentElement.classList.remove('dark');
    setTheme({ themeMode: 'light' });
  }

  function setToDark() {
    document.documentElement.classList.add('dark');
    setTheme({ themeMode: 'dark' });
  }

  const toggleTheme = () => {
    if (theme?.themeMode === 'light') {
      setToDark();
    } else {
      setToLight();
    }
  };

  useEffect(() => {
    if (!theme?.themeMode) {
      window.matchMedia('(prefers-color-scheme: dark)').matches
        ? setToDark()
        : setToLight();
    }
  }, [theme?.themeMode]);

  useMemo(() => {
    if (typeof window !== 'undefined') {
      window
        .matchMedia('(prefers-color-scheme: dark)')
        .addEventListener('change', (event) => {
          event.matches ? setToDark() : setToLight();
        });
    }
  }, []);

  return (
    <ThemeStateContext.Provider value={theme}>
      <ThemeDispatchContext.Provider value={toggleTheme}>
        <ThemeProvider
          theme={theme?.themeMode === 'light' ? lightTheme : darkTheme}
        >
          {props.children}
        </ThemeProvider>
      </ThemeDispatchContext.Provider>
    </ThemeStateContext.Provider>
  );
};

export const useAppTheme: () => AppTheme = () => {
  return useTheme() as AppTheme;
};

export const useThemeState: () => IThemeState = () => {
  const themeState = useContext(ThemeStateContext);
  if (!themeState) {
    throw new Error(
      'ThemeDispatchContext must be used within the AppThemeProvider',
    );
  }
  return themeState;
};

export const useThemeToggle: () => VoidFunction = () => {
  const themeToggle = useContext(ThemeDispatchContext);
  if (!themeToggle) {
    throw new Error(
      'ThemeDispatchContext must be used within the AppThemeProvider',
    );
  }
  return themeToggle;
};

export default AppThemeProvider;
