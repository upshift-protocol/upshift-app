import { FALLBACK_CHAINID } from '../constants/web3';

export function renderVariant(status: 'PENDING' | 'REDEEM' | 'STAKED') {
  switch (status) {
    case 'STAKED':
      return 'primary';
    case 'REDEEM':
      return 'success';
    default:
      return 'primary';
  }
}

export function formatCompactNumber(
  number: number,
  options?: { symbol?: boolean },
) {
  const formatter = Intl.NumberFormat('en-US', {
    notation: 'compact',
    currencySign: 'standard',
    style: options?.symbol ? 'currency' : undefined,
    currency: 'USD',
    minimumSignificantDigits: 6,
    maximumSignificantDigits: 6,
  });
  return formatter.format(number);
}

export function formatChainForImg(chainId?: number, chains?: any) {
  const value = chains?.find(
    (chain: any) => chain.id === Number(chainId),
  )?.name;
  if (!value)
    return {
      chainId,
      formatted: '/chains/unknown.svg',
    };
  let formatted: string = value;
  if (value?.includes(' ')) formatted = value?.replaceAll(' ', '-');
  return {
    chainId,
    formatted: `/chains/${formatted && formatted !== '-' ? formatted : FALLBACK_CHAINID}.svg`,
  };
}

export function getChainNameById(chainId?: number | string) {
  switch (Number(chainId)) {
    case 42161:
      return 'Arbitrum One';
    default:
      return 'Mainnet';
  }
}
