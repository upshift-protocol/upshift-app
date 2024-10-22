import { type IPool, type IPoolLoan } from '@augustdigital/sdk';
import { getTokenSymbol } from './ui';

export function getProtocolExposureData(pool: IPool) {
  const protocolAllocation: { [key: string]: number } = {};

  const loans = pool.loans ? [...pool.loans] : [];

  loans.forEach((loan: IPoolLoan) => {
    if (!loan.positions || loan.positions.length === 0) return;

    // @ts-expect-error
    loan.positions.forEach((position: { label: string; value: string }) => {
      protocolAllocation[position.label] =
        (protocolAllocation[position.label] || 0) + loan.allocation * 100;
    });
  });

  const totalAllocation = Object.values(protocolAllocation).reduce(
    (acc, value) => acc + value,
    0,
  );

  const normalizedProtocolAllocation = { ...protocolAllocation };
  Object.keys(normalizedProtocolAllocation).forEach((key) => {
    const allocation = normalizedProtocolAllocation[key] ?? 0;
    normalizedProtocolAllocation[key] = (allocation / totalAllocation) * 100;
  });

  const labels = Object.keys(normalizedProtocolAllocation);
  const data = Object.values(normalizedProtocolAllocation);

  return {
    labels,
    datasets: [
      {
        label: '',
        data,
        borderWidth: 0,
        backgroundColor: [
          '#333333',
          '#AAAAAA',
          '#FFC107',
          '#FF9800',
          '#2196F3',
          '#4CAF50',
          '#F44336',
          '#795548',
          '#9C27B0',
          '#03A9F4',
          '#607D8B',
          '#FFEB3B',
          '#E91E63',
          '#00BCD4',
          '#CDDC39',
        ],
        hoverBackgroundColor: [
          '#444444',
          '#E0E0E0',
          '#FFC107',
          '#FF9800',
          '#2196F3',
          '#4CAF50',
          '#F44336',
          '#8D6E63',
          '#BA68C8',
          '#4FC3F7',
          '#78909C',
          '#FFF176',
          '#F06292',
          '#26C6DA',
          '#C0CA33',
        ],
      },
    ],
  };
}

export function getTokenExposureData(pool: IPool) {
  if (!pool || !Array.isArray(pool.loans)) {
    return {
      labels: [],
      datasets: [],
    };
  }

  const tokenAllocation: { [token: string]: number } = {};

  pool.loans.forEach((loan: IPoolLoan) => {
    // @ts-expect-error
    loan.exposure?.forEach((token: { value: string; label: string }) => {
      let tokenSymbol = getTokenSymbol(token.value, pool.chainId);

      if (tokenSymbol.length > 30) {
        tokenSymbol = token.label;
      }

      if (!tokenSymbol.includes('_')) {
        tokenAllocation[tokenSymbol] =
          (tokenAllocation[tokenSymbol] || 0) + loan.allocation * 100;
      }
    });
  });

  const labels = Object.keys(tokenAllocation);
  const data = Object.values(tokenAllocation);

  return {
    labels,
    datasets: [
      {
        label: '',
        data,
        borderWidth: 0,
        backgroundColor: [
          '#333333',
          '#AAAAAA',
          '#FFC107',
          '#FF9800',
          '#2196F3',
          '#4CAF50',
          '#F44336',
          '#795548',
          '#9C27B0',
          '#03A9F4',
          '#607D8B',
          '#FFEB3B',
          '#E91E63',
          '#00BCD4',
          '#CDDC39',
        ],
        hoverBackgroundColor: [
          '#444444',
          '#E0E0E0',
          '#FFC107',
          '#FF9800',
          '#2196F3',
          '#4CAF50',
          '#F44336',
          '#8D6E63',
          '#BA68C8',
          '#4FC3F7',
          '#78909C',
          '#FFF176',
          '#F06292',
          '#26C6DA',
          '#C0CA33',
        ],
      },
    ],
  };
}
