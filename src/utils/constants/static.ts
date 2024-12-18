type AdditionalField = { label: string; value: string | number };

type StrategyDetails = {
  additionalFields: AdditionalField[];
  rewardsField?: AdditionalField;
};

export const poolStrategies: Record<string, StrategyDetails> = {
  ethena: {
    additionalFields: [
      { label: 'sUSDe APY', value: '21%' },
      { label: 'Leverage Loop APR', value: '17.5%' },
      { label: 'Leverage', value: '3.2x' },
    ],
  },
  // "avalanche ausd": {
  //   additionalFields: [
  //     { label: "Avax incentives APR", value: "Read from stake page APR" },
  //     { label: "Total APY", value: "24% + 23% = 46%" },
  //   ],
  //   rewardsField: { label: "Staking APR", value: "Read from stake page APR" },
  // },
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
