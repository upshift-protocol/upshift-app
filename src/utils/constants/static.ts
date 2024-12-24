type AdditionalField = { label: string; value: string | number };

type StrategyDetails = {
  additionalFields: AdditionalField[];
  rewardsField?: AdditionalField;
};

export const poolStrategies: Record<string, StrategyDetails> = {
  ethena: {
    additionalFields: [
      { label: 'avg APY', value: '14%' },
      { label: 'sUSDe APY', value: '12%' },
      { label: 'Leverage Loop APR', value: '2%' },
      { label: 'Leverage', value: '3.2x' },
    ],
  },
  'avalanche ausd': {
    additionalFields: [
      { label: 'Avax incentives APR', value: '' },
      { label: 'Total APY', value: '' },
    ],
  },
};

export const getStrategyDetails = (
  name: string,
): StrategyDetails | null | undefined => {
  if (!name) return null;

  const lowerName = name.toLocaleLowerCase();

  const matchingKey = Object.keys(poolStrategies).find(
    (key): key is keyof typeof poolStrategies =>
      lowerName.includes(key.toLocaleLowerCase()),
  );

  return matchingKey ? poolStrategies[matchingKey] : null;
};
