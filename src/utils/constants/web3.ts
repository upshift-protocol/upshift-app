export const INFURA_API_KEY = process.env.NEXT_PUBLIC_INFURA_API_KEY || '';

export const NETWORK =
  (process.env.NEXT_PUBLIC_NETWORK as 'localhost' | 'arbitrum') ?? 'arbitrum';

export const FALLBACK_CHAINID = 42161;

export const FALLBACK_TOKEN_IMG =
  'https://etherscan.io/images/main/empty-token.png';
