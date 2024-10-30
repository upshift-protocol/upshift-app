import { augustSdk } from '@/config/august-sdk';
import { buildQueryKey } from '@/utils/helpers/query';
import type { IAddress, IChainId } from '@augustdigital/sdk';
import { POOL_ADDRESSES } from '@augustdigital/sdk';
import { useQueries } from '@tanstack/react-query';
import { useChainId } from 'wagmi';

interface IUsePools {
  pool?: IAddress;
  enabled?: boolean;
}

export default function usePools(props?: IUsePools) {
  const chainId = useChainId();
  const poolAddresses = props?.pool
    ? [props.pool]
    : Object.values(POOL_ADDRESSES?.[chainId as IChainId]);

  const queries = useQueries({
    queries: poolAddresses.map((address) => ({
      queryFn: () =>
        augustSdk.pools.getPool(address as IAddress, chainId as IChainId, {
          allocations: false,
          loans: false,
        }),
      queryKey: buildQueryKey('lending-pool', undefined, address),
      enabled: typeof props?.enabled === 'undefined' ? true : props?.enabled,
    })),
  });

  return queries;
}
