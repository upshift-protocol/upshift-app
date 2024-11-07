export const INFURA_API_KEY = process.env.NEXT_PUBLIC_INFURA_API_KEY || '';
export const ALCHEMY_API_KEY = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY || '';

export const NETWORK =
  (process.env.NEXT_PUBLIC_NETWORK as 'localhost' | 'arbitrum' | 'mainnet') ??
  'mainnet';

export const DEVELOPMENT_MODE = process.env.NEXT_PUBLIC_DEV ? 1 : 0;

export const FALLBACK_CHAINID = 43114;

export const RPC_URLS = {
  // 43114: `https://alien-little-hill.avalanche-mainnet.quiknode.pro/ac22aebf0974c406f923035ed5bd499365bf298f/ext/bc/C/rpc/`
  43114: `https://avax-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
  1: `https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
};
