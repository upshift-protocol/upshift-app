import { zeroAddress } from 'viem';
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
