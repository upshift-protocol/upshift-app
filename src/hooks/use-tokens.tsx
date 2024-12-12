import { type IAddress, type IPoolWithUnderlying } from '@augustdigital/sdk';
import type { UseQueryResult } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import { augustSdk } from '@/config/august-sdk';
import { zeroAddress } from 'viem';
import { avalanche } from 'viem/chains';
import useFetcher from './use-fetcher';

// interfaces
interface IUseToken {
  enabled?: boolean;
  address?: IAddress;
}

interface IUseTokenReturnValue {
  address: IAddress;
  chain: number;
  decimals: number;
  price: number;
  symbol: string;
}

// main hook
/**
 * @deprecated use usePoolsStore prices object instead
 */
export default function useTokens(options?: IUseToken) {
  const { data: allPools } = useFetcher({
    queryKey: ['lending-pools'],
  }) as UseQueryResult<IPoolWithUnderlying[]>;

  const getAllPrices = async (): Promise<IUseTokenReturnValue[]> => {
    if (options?.address) {
      const foundPool = allPools?.find(
        (p) =>
          p?.underlying?.address?.toLowerCase() ===
          options?.address?.toLowerCase(),
      );
      if (!foundPool) {
        console.error('#getAllPrices:', 'foundPool is undefined');
        return [];
      }
      const price = await augustSdk.getPrice(
        foundPool.underlying.symbol.toLowerCase(),
      );
      return [
        {
          ...foundPool.underlying,
          price,
        },
      ];
    }
    const promises = await Promise.all(
      allPools?.length
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

    const avaxPrice = await augustSdk.getPrice('avax');
    promises.push({
      address: zeroAddress,
      chain: avalanche.id, // AVAX
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
