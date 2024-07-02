import type { ReactNode } from 'react';

export type INavItem = {
  text: string;
  link: string;
  target: '_blank' | '_self';
};

export type IChildren = {
  children: ReactNode;
};

export type ITheme = 'light' | 'dark';

export interface IColumn {
  id: string;
  value: string;
  minWidth?: number;
  align?: 'right';
  format?: (value: number) => string;
}
