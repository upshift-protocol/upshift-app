import type { INavItem } from './types';

export const FALLBACK_TOKEN_IMG =
  'https://etherscan.io/images/main/empty-token.png';

export const STYLE_VARS = {
  widthWide: '120rem',
  width: '100rem',
  descriptionWidth: '800px',
  assetDivWidth: '60px',
};

export const LINKS = {
  home: '/',
  about: '/',
  contact: '/',
};

export const NAV_ITEMS: INavItem[] = [
  {
    link: LINKS.home,
    text: 'Home',
    target: '_blank',
  },
  {
    link: LINKS.about,
    text: 'About',
    target: '_blank',
  },
  {
    link: LINKS.contact,
    text: 'Contact',
    target: '_blank',
  },
];
