import { darken, lighten } from 'polished';

interface Palette {
  primary: string;
  primaryBg: string;
  accent?: string;
  accentBg?: string;
  border?: string;
}

export interface AppTheme {
  default: Palette & { border: string };
  navbar: Palette & { accentBg: string };
}

export const lightTheme: AppTheme = {
  default: {
    primary: 'black',
    primaryBg: 'white',
    border: '#cccccc',
  },
  navbar: {
    primary: darken(0.1, '#006699'),
    primaryBg: 'white',
    accentBg: lighten('0.5', '#006699'),
  },
};

export const darkTheme: AppTheme = {
  default: {
    primary: 'white',
    primaryBg: 'black',
    border: '#333333',
  },
  navbar: {
    primary: lighten('0.5', '#006699'),
    primaryBg: 'black',
    accentBg: darken(0.1, '#006699'),
  },
};
