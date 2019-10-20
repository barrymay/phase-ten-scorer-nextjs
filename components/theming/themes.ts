import { darken, lighten } from 'polished';

interface Palette {
  primary: string;
  primaryAlt?: string;
  primaryBg: string;
  primaryBgAlt?: string;
  primaryCardBg?: string;
  accent?: string;
  accentBg?: string;
  border?: string;
}

export interface AppTheme {
  default: Palette & { border: string; primaryBgAlt: string };
  navbar: Palette & { primaryAlt: string; primaryBgAlt: string };
}

export const lightTheme: AppTheme = {
  default: {
    primary: 'black',
    primaryBg: 'white',
    primaryBgAlt: darken(0.1, 'white'),
    border: '#cccccc',
  },
  navbar: {
    primary: darken(0.1, '#006699'),
    primaryAlt: lighten(0.2, '#006699'),
    primaryBg: lighten(0.1, '#006699'),
    primaryBgAlt: 'white',
  },
};

export const darkTheme: AppTheme = {
  default: {
    primary: 'white',
    primaryBg: 'black',
    primaryBgAlt: lighten(0.1, 'black'),
    border: '#333333',
  },
  navbar: {
    primary: 'white',
    primaryAlt: darken(0.2, 'white'),
    primaryBg: 'black',
    primaryBgAlt: darken(0.1, '#006699'),
  },
};
