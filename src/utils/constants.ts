import type { INavItem } from './types';

export const INFURA_API_KEY = process.env.NEXT_PUBLIC_INFURA_API_KEY || '';

export const NETWORK =
  (process.env.NEXT_PUBLIC_NETWORK as 'localhost' | 'arbitrum') ?? 'arbitrum';

export const FALLBACK_CHAINID = 42161;

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
};

export const NAV_ITEMS: INavItem[] = [
  {
    link: LINKS.home,
    text: 'Home',
    target: '_blank',
  },
];

export const BUTTON_TEXTS = {
  zero: 'Input an Amount',
  submit: 'Submit Transaction',
  error: 'Error Executing Transaction',
  success: 'Transaction Complete',
  submitting: 'Submitting Transaction',
  approve: 'Approve Input Amount',
  approving: 'Approving Input Amount',
};

export const TIMES = {
  load: 200, // 200ms used for mocking api calls
};
