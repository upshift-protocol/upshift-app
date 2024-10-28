import type { IAddress, IPoolWithUnderlying } from '@augustdigital/sdk';
import type { UseQueryResult } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import { augustSdk } from '@/config/august-sdk';
import useFetcher from './use-fetcher';

type IUseToken = {
  enabled?: boolean;
};

export default function useTokens(options?: IUseToken) {
  const { data: allPools } = useFetcher({
    queryKey: ['lending-pools'],
  }) as UseQueryResult<IPoolWithUnderlying[]>;

  const getAllPrices = async () => {
    const promises = await Promise.all(
      allPools
        ? allPools?.map(async (p) => {
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
    return promises as {
      address: IAddress;
      chain: number;
      decimals: number;
      price: number;
      symbol: string;
    }[];
  };

  const query = useQuery({
    queryKey: ['all-prices'],
    enabled: !!allPools && allPools?.length > 0 && (options?.enabled || true),
    queryFn: getAllPrices,
  });

  return query;
}
