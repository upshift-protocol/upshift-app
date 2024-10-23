export const INFURA_API_KEY = process.env.NEXT_PUBLIC_INFURA_API_KEY || '';
export const ALCHEMY_API_KEY = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY || '';

export const NETWORK =
  (process.env.NEXT_PUBLIC_NETWORK as 'localhost' | 'arbitrum' | 'mainnet') ??
  'mainnet';

export const DEVELOPMENT_MODE = process.env.NEXT_PUBLIC_DEV ? 1 : 0;

export const FALLBACK_CHAINID = 1;
