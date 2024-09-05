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
