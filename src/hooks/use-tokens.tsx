import {
  toNormalizedBn,
  type IAddress,
  type IPoolWithUnderlying,
  AVAX_PRICE_FEED_ADDRESS,
  ABI_CHAINLINK_V3,
} from '@augustdigital/sdk';
import type { UseQueryResult } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import { augustSdk } from '@/config/august-sdk';
import { useReadContract } from 'wagmi';
import { zeroAddress } from 'viem';
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
export default function useTokens(options?: IUseToken) {
  const avaxPriceFeedAddress = AVAX_PRICE_FEED_ADDRESS(1);

  const { data: avaxPrice } = useReadContract({
    address: avaxPriceFeedAddress,
    abi: ABI_CHAINLINK_V3,
    functionName: 'latestRoundData',
    chainId: 1,
  });

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

    promises.push({
      address: zeroAddress,
      chain: 43114, // AVAX
      decimals: 18,
      price:
        Array.isArray(avaxPrice) &&
        Number(toNormalizedBn(avaxPrice[1], 8).normalized),
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
