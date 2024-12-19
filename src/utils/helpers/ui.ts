import { zeroAddress } from 'viem';
import { round } from '@augustdigital/sdk';
import { FALLBACK_CHAINID } from '../constants';

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
  options?: { symbol?: boolean; decimals?: number },
) {
  const isBigNumber = number > 10_000;
  const formatter = Intl.NumberFormat('en-US', {
    notation: 'compact',
    currencySign: 'standard',
    style: options?.symbol ? 'currency' : undefined,
    currency: 'USD',
    minimumFractionDigits: options?.decimals
      ? options?.decimals
      : options?.symbol || isBigNumber
        ? 2
        : 4,
    maximumFractionDigits: options?.decimals
      ? options?.decimals
      : options?.symbol || isBigNumber
        ? 2
        : 4,
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
      formatted: '/img/chains/unknown.svg',
    };
  return {
    chainId,
    formatted: `/img/chains/${chainId || FALLBACK_CHAINID}.svg`,
  };
}

export function getChainNameById(chainId?: number | string) {
  switch (Number(chainId)) {
    case 42161:
      return 'Arbitrum One';
    case 43114:
      return 'Avalanche';
    case 8453:
      return 'Base';
    default:
      return 'Mainnet';
  }
}

export function getNativeTokenByChainId(chainId?: number | string) {
  switch (Number(chainId)) {
    case 43114:
      return 'AVAX';
    default:
      return 'ETH';
  }
}

export function getTokenSymbol(address: string, chainId?: number | string) {
  const lowercaseAddress = address?.toLowerCase();
  if (lowercaseAddress === zeroAddress)
    return getNativeTokenByChainId(chainId || FALLBACK_CHAINID);
  switch (Number(chainId)) {
    case 42161: {
      return address;
    }
    default: {
      if (lowercaseAddress === '0xa1290d69c65a6fe4df752f95823fae25cb99e5a7')
        return 'rsETH';
      if (lowercaseAddress === '0x54e44dbb92dba848ace27f44c0cb4268981ef1cc')
        return 'Karak XP';
      return address;
    }
  }
}

export function formatUsd(value: string | number) {
  const formatCurrency = new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: 'USD',
  });
  const formatted = formatCurrency.format(Number(value));
  if (formatted.includes(',')) return formatted.split('.')[0];
  return formatted;
}

/**
 * @deprecated
 */
export function renderBiggerApy(hardcodedApy?: string, realApy?: number) {
  if (!hardcodedApy)
    return realApy && Number(realApy) >= 1
      ? `${round(realApy || '0', { showing: 2 })}%`
      : '-';
  if (hardcodedApy === '-') return hardcodedApy;
  const hardApy = Number(hardcodedApy?.replaceAll('%', '') || '0');
  const apy = Number(realApy || '0');
  if (apy > hardApy) return `${round(realApy || '0', { showing: 2 })}%`;
  return `${hardcodedApy}`;
}

export function renderPartnerImg(point: string) {
  const lowerPoint = point.toLowerCase();
  if (lowerPoint.includes('kelp')) return 'kelp-miles.svg';
  if (lowerPoint.includes('sats')) return 'ethena.svg';
  if (lowerPoint.includes('zircuit')) return 'zircuit.svg';
  if (lowerPoint.includes('hemi')) return 'hemi.svg';
  if (lowerPoint.includes('eigen')) return 'eigen.svg';
  if (lowerPoint.includes('karak')) return 'karak.svg';
  if (lowerPoint.includes('lombard')) return 'lombard.svg';
  if (lowerPoint.includes('babylon')) return 'babylon.png';
  if (lowerPoint.includes('treehouse')) return 'treehouse.svg';
  return '';
}
