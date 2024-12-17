export interface TooltipMapping {
  [key: string]: string;
}

export const tooltipMapping: TooltipMapping = {
  'ethena growth susde': '~21% sUSDe and ~17.5% from leveraged loop',
  'high growth eth': 'Inclusive of rsETH native and restaking yield.',
  'kelp gain': 'Inclusive of rsETH native and restaking yield.',
};

export const getTooltip = (key: string): string | undefined => {
  return tooltipMapping[key];
};
