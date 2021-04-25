import React, { useState, useContext } from 'react';
import { ThemeProvider, useTheme } from '@emotion/react';
import { darkTheme, lightTheme, AppTheme } from './themes';

interface IThemeState {
  themeMode: 'dark' | 'light';
}

const ThemeStateContext = React.createContext<IThemeState | undefined>(
  undefined,
);
const ThemeDispatchContext = React.createContext<(() => void) | undefined>(
  undefined,
);

const AppThemeProvider: React.FC = props => {
  const [theme, setTheme] = useState<IThemeState>({ themeMode: 'light' });
  const toggleTheme = () => {
    setTheme({ themeMode: theme.themeMode === 'light' ? 'dark' : 'light' });
  };
  return (
    <ThemeStateContext.Provider value={theme}>
      <ThemeDispatchContext.Provider value={toggleTheme}>
        <ThemeProvider
          theme={theme.themeMode === 'light' ? lightTheme : darkTheme}
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
