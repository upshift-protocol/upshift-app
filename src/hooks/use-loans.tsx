import type { IAddress, INormalizedNumber } from '@augustdigital/sdk';
import { ABI_LOAN, toNormalizedBn } from '@augustdigital/sdk';
import { useMemo } from 'react';
import { useReadContracts } from 'wagmi';

type IPoolLoan = {
  currentApr: INormalizedNumber;
  collateralToken: IAddress;
  effectiveLoanAmount: INormalizedNumber;
  loanAmountInPrincipalTokens: INormalizedNumber;
  principalAmount: INormalizedNumber;
  principalRepaid: INormalizedNumber;
  principalToken: IAddress;
  loanState: number;
  address: IAddress;
};

const readFunctions = [
  'currentApr',
  'collateralToken',
  'effectiveLoanAmount',
  'loanAmountInPrincipalTokens',
  'principalAmount',
  'principalRepaid',
  'principalToken',
  'loanState',
];

export default function useLoans(loanAddresses?: IAddress[]) {
  const list = loanAddresses?.length ? loanAddresses : [];

  const { data: loansWithData, isLoading } = useReadContracts({
    contracts: readFunctions
      .map((func) => {
        return list.map((l) => ({
          address: l as IAddress,
          abi: ABI_LOAN,
          functionName: func,
        }));
      })
      .flat(),
  });

  const loans = useMemo(() => {
    if (isLoading) return [];
    const reads = list.map((_loan) => {
      return readFunctions.reduce((acc, curr, i) => {
        const returnValue = (val?: any) => {
          if (curr === 'currentApr') return toNormalizedBn(val, 2); // TODO: is this correct for 1000n BigInt
          if (typeof val === 'bigint') return toNormalizedBn(val); // TODO: add decimals
          return val;
        };
        return {
          ...acc,
          address: _loan,
          [curr]: returnValue(((loansWithData as any)?.[i] as any)?.result),
        };
      }, {} as IPoolLoan);
    });
    return reads;
  }, [loansWithData as any, isLoading]);

  return {
    loans,
    isLoading,
  };
}
