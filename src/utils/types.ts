import type { ReactNode } from 'react';
import type { IAddress, IChainId, INormalizedNumber } from '@augustdigital/sdk';

export type IActions = 'deposit' | 'approve' | 'withdraw' | 'redeem';

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

export type IPoolMetadata = {
  lockTime?: INormalizedNumber;
  loading?: boolean;
  apy?: string | number;
  hardcodedApy?: string; // @todo remove once we don't hardcode anymore
  collateral?: string[];
};

export interface IColumn {
  id: string;
  value: string;
  minWidth?: number;
  align?: 'right';
  format?: (value: number) => string;
  component?: any;
  flex?: number;
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
  variant?: 'glass' | 'default';
  imgSize?: number;
  truncate?: boolean;
  imgFallback?: boolean;
  loading?: boolean;
  chainId?: number;
  tooltip?: boolean;
};

export type IDepositLog = {
  pool: string;
  token: string;
  chain: string;
  amount_native: string;
  amount_usd: string;
  eoa: string;
  tx_id: string;
};

export type IDepositLogData = {
  pool_address: IAddress;
  pool_name: string;
  token_address: IAddress;
  token_symbol: string;
  chain: IChainId;
  amount_native: string;
  eoa: IAddress;
  tx_id: string;
};

export type IActiveStakePosition = {
  stakingToken: {
    decimals: number;
    symbol: string;
    address: IAddress;
    chain: number;
    totalStaked: INormalizedNumber;
    usd: INormalizedNumber;
    totalSupply?: INormalizedNumber;
    name: string;
  };
  rewardToken: {
    decimals: number;
    symbol: string;
    address: IAddress;
    chain: number;
    redeemable: INormalizedNumber;
    usd: INormalizedNumber;
    name: string;
  };
  rewardDistributor: IAddress;
  rewardPerSecond: INormalizedNumber;
  apy?: number;
  chainId: number;
  id: string;
};
export type INewReferralBody = {
  address: string;
  codeUsed: string;
  newCode: string;
};

export interface IReferralRecord {
  eoa: string;
  referral: string;
  codeUsed: string;
  codes: string[];
}

export interface ITokenPrice {
  price: number;
  address: IAddress;
  symbol: string;
  decimals: number;
  chain: number;
}
