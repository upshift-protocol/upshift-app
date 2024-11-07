import type { IChildren } from '@/utils/types';
import React, { createContext, useContext } from 'react';
import type { IPoolWithUnderlying } from '@augustdigital/sdk';
import type { UseQueryResult } from '@tanstack/react-query';
import useFetcher from '@/hooks/use-fetcher';

interface PoolsContextValue {
  pools: UseQueryResult<IPoolWithUnderlying[], Error>;
}

const PoolsContext = createContext<PoolsContextValue | undefined>(undefined);

const PoolsProvider = ({ children }: IChildren) => {
  const pools = useFetcher({
    queryKey: ['lending-pools'],
  }) as UseQueryResult<IPoolWithUnderlying[], Error>;

  return (
    <PoolsContext.Provider value={{ pools }}>{children}</PoolsContext.Provider>
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
