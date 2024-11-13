import { type IPool, type IPoolLoan } from '@augustdigital/sdk';
import { getTokenSymbol } from './ui';

export function getProtocolExposureData(pool: IPool) {
  const protocolAllocation: { [key: string]: number } = {};
  const logoDetails: { [key: string]: string } = {};
  const positionLengths: number[] = [];

  const loans = pool.loans ? [...pool.loans] : [];

  loans.forEach((loan: IPoolLoan) => {
    positionLengths.push(loan.positions ? loan.positions.length : 0);
  });

  loans.forEach((loan: IPoolLoan, index: number) => {
    if (!loan.positions || loan.positions.length === 0) return;

    const allocationPerPosition =
      (loan.allocation * 100) / (positionLengths[index] || 1);

    loan.positions.forEach((position: { label: string; value: string }) => {
      protocolAllocation[position.label] =
        (protocolAllocation[position.label] || 0) + allocationPerPosition;

      logoDetails[position.label] = position.value;
    });
  });

  const labels = Object.keys(protocolAllocation);
  const data = Object.values(protocolAllocation);

  return {
    labels,
    datasets: [
      {
        label: '',
        data,
        logoDetails,
        borderWidth: 0,
        backgroundColor: [
          '#AAAAAA',
          '#FFC107',
          '#FF9800',
          '#2196F3',
          '#4CAF50',
          '#F44336',
          '#9C27B0',
          '#03A9F4',
          '#607D8B',
          '#FFEB3B',
          '#E91E63',
          '#00BCD4',
          '#CDDC39',
        ],
        hoverBackgroundColor: [
          '#E0E0E0',
          '#FFC107',
          '#FF9800',
          '#2196F3',
          '#4CAF50',
          '#F44336',
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
    logoDetails,
    positionLengths,
  };
}

type IExposureValue = { value: string; label: string; usd: number };
export function getTokenExposureData(pool: IPool) {
  if (!pool || !Array.isArray(pool.loans)) {
    return {
      labels: [],
      datasets: [],
    };
  }
  const tokenAllocation: { [token: string]: number } = {};
  const filteredExposureData: number[] = [];

  pool.loans.forEach((loan: IPoolLoan) => {
    const validExposure =
      (loan.exposure as Array<IExposureValue> | undefined)?.filter(
        (token) => getTokenSymbol(token.value, pool.chainId) !== 'eth',
      ) || [];

    const validCount = validExposure.filter((token) => {
      let tokenSymbol = getTokenSymbol(token.value, pool.chainId);
      if (tokenSymbol.length > 30) tokenSymbol = token.label;
      return !tokenSymbol.includes('_');
    }).length;

    filteredExposureData.push(validCount);
  });

  pool.loans.forEach((loan: IPoolLoan) => {
    const validExposure =
      (loan.exposure as Array<IExposureValue> | undefined)?.filter(
        (token) => getTokenSymbol(token.value, pool.chainId) !== 'eth',
      ) || [];

    validExposure.forEach((token) => {
      let tokenSymbol = getTokenSymbol(token.value, pool.chainId);
      if (tokenSymbol.length > 30) {
        tokenSymbol = token.label;
      }
      if (!tokenSymbol.includes('_')) {
        const allocationShare = token.usd * Number(loan.allocation); // unnecessary but makes number smaller and less prone to errors
        tokenAllocation[tokenSymbol] =
          (tokenAllocation[tokenSymbol] || 0) + allocationShare;
      }
    });
  });
  const values = Object.values(tokenAllocation);
  const totalUsd = values.reduce((prev, acc) => prev + acc, 0);
  const labels = Object.keys(tokenAllocation);
  const data = values.map((val) => (val / totalUsd) * 100);

  return {
    labels,
    datasets: [
      {
        label: '',
        data,
        borderWidth: 0,
        backgroundColor: [
          '#AAAAAA',
          '#FFC107',
          '#FF9800',
          '#2196F3',
          '#4CAF50',
          '#F44336',
          '#9C27B0',
          '#03A9F4',
          '#607D8B',
          '#FFEB3B',
          '#E91E63',
          '#00BCD4',
          '#CDDC39',
        ],
        hoverBackgroundColor: [
          '#E0E0E0',
          '#FFC107',
          '#FF9800',
          '#2196F3',
          '#4CAF50',
          '#F44336',
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
