import type { IPoolWithUnderlying } from '@augustdigital/sdk';

const USDC = '0xaf88d065e77c8cC2239327C5EDb3A432268e5831';

// TODO: delete once data is being pulled from SDK
const MOCK_POOLS: IPoolWithUnderlying[] = [
  {
    decimals: 6,
    symbol: 'LP-AUG-USDC',
    name: 'August Credit Pool - USDC',
    apy: 0,
    collateral: [USDC],
    asset: USDC,
    underlying: {
      symbol: 'USDC',
      decimals: 6,
      address: USDC,
    },
    totalSupply: {
      normalized: '0.0',
      raw: BigInt(0),
    },
    totalAssets: {
      normalized: '0.0',
      raw: BigInt(0),
    },
    globalLoansAmount: {
      normalized: '0.0',
      raw: BigInt(0),
    },
    getLoansOperator: '0xF1211724F7fe848e193227F2BEBC45608A3215C4',
    address: '0x4390154D112B3C86ea4dDbd53f68bA3Ef7DDA5A8',
  },
];

export default MOCK_POOLS;
