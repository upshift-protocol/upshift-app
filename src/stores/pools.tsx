import type { IChildren } from '@/utils/types';
import React, { createContext, useContext } from 'react';
import type { IAddress, IPoolWithUnderlying } from '@augustdigital/sdk';
import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import useFetcher from '@/hooks/use-fetcher';
import { useAccount } from 'wagmi';
import { augustSdk } from '@/config/august-sdk';

interface PoolsContextValue {
  pools: UseQueryResult<IPoolWithUnderlying[], Error>;
  positions: UseQueryResult<(IPoolWithUnderlying & any)[], Error>;
}

const PoolsContext = createContext<PoolsContextValue | undefined>(undefined);

const PoolsProvider = ({ children }: IChildren) => {
  const { address } = useAccount();

  const pools = useFetcher({
    queryKey: ['lending-pools'],
  }) as UseQueryResult<IPoolWithUnderlying[], Error>;

  const positions = useQuery({
    queryKey: ['my-positions', address],
    queryFn: () => augustSdk.pools.getAllPositions(address as IAddress),
    initialData: [],
  });

  return (
    <PoolsContext.Provider value={{ pools, positions }}>
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
