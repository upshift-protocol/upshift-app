import type { IChildren, ITokenPrice } from '@/utils/types';
import React, { createContext, useContext } from 'react';
import type { IAddress } from '@augustdigital/sdk';
import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { augustSdk } from '@/config/august-sdk';
import { zeroAddress } from 'viem';
import { avalanche } from 'viem/chains';
import { usePoolsStore } from './pools';

interface PricesContextValue {
  prices: UseQueryResult<ITokenPrice[], Error>;
}

const PricesContext = createContext<PricesContextValue | undefined>(undefined);

const PricesProvider = ({ children }: IChildren) => {
  const { pools } = usePoolsStore();

  const prices = useQuery({
    queryKey: ['token-prices'],
    queryFn: async () => {
      const promises = await Promise.all(
        pools?.data?.length
          ? pools?.data?.map(async (p) => {
              const price = await augustSdk.getPrice(
                p.underlying?.symbol?.toLowerCase(),
              );
              return {
                ...p.underlying,
                price,
              };
            })
          : [],
      );
      const avaxPrice = await augustSdk.getPrice('avax');
      promises.push({
        address: zeroAddress,
        chain: avalanche.id,
        decimals: 18,
        price: avaxPrice,
        symbol: 'AVAX',
      } as unknown as {
        address: IAddress;
        chain: number;
        decimals: number;
        price: number;
        symbol: string;
      });
      return promises;
    },
    enabled: pools.isFetched,
  });

  return (
    <PricesContext.Provider
      value={{
        prices,
      }}
    >
      {children}
    </PricesContext.Provider>
  );
};

const usePricesStore = (): PricesContextValue => {
  const context = useContext(PricesContext);
  if (!context) {
    throw new Error('usePricesStore must be used within a PoolsProvider');
  }
  return context;
};

export { PricesProvider, usePricesStore };
