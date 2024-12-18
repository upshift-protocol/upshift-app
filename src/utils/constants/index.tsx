import Stack from '@mui/material/Stack';
import type { GridSortDirection } from '@mui/x-data-grid';
import type { INavItem } from '../types';

export * from './time';

/**
 * Environment Variables
 */
export const REFERRALS_ENABLED =
  process.env.NEXT_PUBLIC_REFERRALS_ENABLED === 'true';

export const INSTANCE =
  (process.env.NEXT_PUBLIC_INSTANCE as
    | 'avax'
    | 'lombard'
    | 'treehouse'
    | 'ethena'
    | undefined) || 'default';

/**
 * UI
 */
export const BUTTON_TEXTS = {
  zero: 'Input an Amount',
  submit: 'Submit Transaction',
  submit_many: (num: number | string) =>
    `Submit ${num} Transaction${Number(num) > 1 ? 's' : ''}`,
  error: 'Error Executing Transaction',
  success: 'Transaction Complete',
  submitting: 'Submitting Transaction',
  approve: 'Approve Input Amount',
  approving: 'Approving Input Amount',
  insufficient: 'Insufficient Balance',
  full: 'Deposit Cap Reached',
};

export const LINKS = {
  home: '/',
  stake: '/stake',
  privacy_policy:
    'https://docs.augustdigital.io/legal/legal-notices/privacy-policy',
  terms_of_service:
    'https://docs.augustdigital.io/legal/legal-notices/terms-of-service',
};

export const NAV_ITEMS: INavItem[] = [
  {
    link: LINKS.home,
    text: 'Deposit',
    target: '_self',
  },
  {
    link: LINKS.stake,
    text: 'Stake',
    target: '_self',
  },
];

export const DATA_TABLE_OPTIONS = ({
  loading,
  rows,
  columns,
  defaultSortKey,
  rowHeight = 60,
  noDataText = 'No Data Available',
  noResultsText = 'Current filters return no results',
  pageSize = 5,
  sortOrder = 'desc',
  pagination = true,
}: {
  loading: boolean;
  rows: any;
  columns: any;
  defaultSortKey: string;
  rowHeight?: number;
  noDataText?: string;
  noResultsText?: string;
  pageSize?: number;
  sortOrder?: GridSortDirection;
  pagination?: boolean;
}) => ({
  loading,
  rows,
  columns,
  rowHeight,
  initialState: {
    pagination: pagination
      ? {
          paginationModel: {
            pageSize,
          },
        }
      : undefined,
    sorting: {
      sortModel: [{ field: defaultSortKey, sort: sortOrder }],
    },
  },
  pageSizeOptions: [pageSize],
  disableRowSelectionOnClick: true,
  slots: {
    noRowsOverlay: () => (
      <Stack height="100%" alignItems="center" justifyContent="center">
        {noDataText}
      </Stack>
    ),
    noResultsOverlay: () => (
      <Stack height="100%" alignItems="center" justifyContent="center">
        {noResultsText}
      </Stack>
    ),
  },
});

/**
 * Styles
 */
export const STYLE_VARS = {
  widthWide: '120rem',
  width: '100rem',
  descriptionWidth: '800px',
  assetDivWidth: '72px',
};

export const HEADER_FONT_WEIGHT = 900;

export const TABLE_HEADER_FONT_WEIGHT = 900;

/**
 * Web3
 */
export const FALLBACK_TOKEN_IMG =
  'https://etherscan.io/images/main/empty-token.png';

export const INFURA_API_KEY = process.env.NEXT_PUBLIC_INFURA_API_KEY || '';
export const ALCHEMY_API_KEY = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY || '';

export const NETWORK =
  (process.env.NEXT_PUBLIC_NETWORK as 'localhost' | 'arbitrum' | 'mainnet') ??
  'mainnet';

export const DEVELOPMENT_MODE = process.env.NEXT_PUBLIC_DEV ? 1 : 0;

export const FALLBACK_CHAINID = 43114;
