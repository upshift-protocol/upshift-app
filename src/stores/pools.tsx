import type { IChildren, ITokenPrice } from '@/utils/types';
import React, { createContext, useContext } from 'react';
import type { IAddress, IPoolWithUnderlying } from '@augustdigital/sdk';
import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import useFetcher from '@/hooks/use-fetcher';
import { useAccount } from 'wagmi';
import { augustSdk } from '@/config/august-sdk';

interface PoolsContextValue {
  pools: UseQueryResult<IPoolWithUnderlying[], Error>;
  positions: UseQueryResult<(IPoolWithUnderlying & any)[], Error>;
  prices: UseQueryResult<ITokenPrice[], Error>;
}

const PoolsContext = createContext<PoolsContextValue | undefined>(undefined);

const PoolsProvider = ({ children }: IChildren) => {
  const { address } = useAccount();

  const pools = useFetcher({
    queryKey: ['lending-pools'],
  }) as UseQueryResult<IPoolWithUnderlying[], Error>;

  const positions = useQuery({
    queryKey: ['my-positions', address],
    queryFn: () =>
      augustSdk.pools.getAllPositions(
        address as IAddress,
        undefined,
        pools?.data,
      ),
    initialData: [],
    enabled: pools.isFetched,
  });

  const prices = useQuery({
    queryKey: ['token-prices'],
    queryFn: () =>
      Promise.all(
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
      ),
    enabled: pools.isFetched,
  });

  return (
    <PoolsContext.Provider value={{ pools, positions, prices }}>
      {children}
    </PoolsContext.Provider>
  );
};

const usePoolsStore = (): PoolsContextValue => {
  const context = useContext(PoolsContext);
  if (!context) {
    throw new Error('usePoolsStore must be used within a PoolsProvider');
  }
  return context;
};

export { PoolsProvider, usePoolsStore };
