import type { IChildren, ITokenPrice } from '@/utils/types';
import React, { createContext, useContext } from 'react';
import type {
  IAddress,
  IChainId,
  IPoolWithUnderlying,
} from '@augustdigital/sdk';
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

  // get all vaults
  const pools = useFetcher({
    queryKey: ['lending-pools'],
    refetchInterval: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  }) as UseQueryResult<IPoolWithUnderlying[], Error>;

  const poolWithLoans = useQuery({
    queryKey: ['pools-with-loans', address],
    queryFn: async () => {
      if (!pools?.data) return [];
      return Promise.all(
        pools.data?.map(async (p) => {
          const loans = await augustSdk.pools.getPoolLoans(
            p,
            p.chainId as IChainId,
          );
          return {
            ...p,
            ...loans,
          };
        }),
      );
    },
    enabled: pools.isFetched && !!pools?.data?.length,
  });

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
    <PoolsContext.Provider
      value={{
        pools: poolWithLoans?.isFetched ? poolWithLoans : pools,
        positions,
        prices,
      }}
    >
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
