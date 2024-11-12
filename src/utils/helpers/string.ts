import type { IPoolWithUnderlying } from '@augustdigital/sdk';

export function truncate(s: string, amount?: number) {
  if (!s) return s;
  return `${s.slice(0, amount ?? 4)}...${s.slice(amount ? amount * -1 : -4)}`;
}

export function stringify(value: any) {
  if (value !== undefined) {
    return JSON.stringify(value, (_, v) =>
      typeof v === 'bigint' ? `${v}n` : v,
    );
  }
  return undefined;
}

export function generateCode(seed: string, length = 12) {
  let result = '';
  const characters = seed;
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

export function routeBuilder(poolData: IPoolWithUnderlying) {
  console.log('POOL DATA:', poolData);
  return `vault_address=${poolData.address}&total_supply=${poolData.totalSupply.normalized}&withdrawal_fee=${poolData.withdrawalFee.normalized}&strategist=${(poolData as any).hardcodedStrategist}&avg_apy=${poolData.hardcodedApy}&liquidity=${Number(poolData?.totalAssets?.normalized || '0') - Number(poolData?.globalLoansAmount?.normalized || '0')}`;
}
