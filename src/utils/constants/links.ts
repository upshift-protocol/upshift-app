import type { INavItem } from '../types';

export const LINKS = {
  home: '/',
  privacy_policy:
    'https://docs.augustdigital.io/legal/legal-notices/privacy-policy',
  terms_of_service:
    'https://docs.augustdigital.io/legal/legal-notices/terms-of-service',
};

export const NAV_ITEMS: INavItem[] = [
  {
    link: LINKS.home,
    text: 'Home',
    target: '_blank',
  },
];
