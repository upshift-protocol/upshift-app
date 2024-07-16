import type { ReactNode } from 'react';
import type { IAddress } from '@augustdigital/sdk';

export type IHrefTarget = '_blank' | '_self';

export type INavItem = {
  text: string;
  link: string;
  target: IHrefTarget;
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

export type IBreadCumb = {
  href: string;
  text: string;
  target?: IHrefTarget;
};

export type IAssetDisplay = {
  symbol?: string;
  img?: string;
  address?: IAddress;
};
