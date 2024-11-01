import {
  toNormalizedBn,
  type IAddress,
  type IPoolWithUnderlying,
} from '@augustdigital/sdk';
import type { UseQueryResult } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import { augustSdk } from '@/config/august-sdk';
import { useReadContract } from 'wagmi';
import { AVAX_PRICE_FEED_ADDRESS } from '@/utils/constants/addresses';
import { abi as ChainLinkAggregatorV3InterfaceABI } from '@/utils/abis/chainlink_v3.json';
import { zeroAddress } from 'viem';
import useFetcher from './use-fetcher';

type IUseToken = {
  enabled?: boolean;
};

export default function useTokens(options?: IUseToken) {
  const avaxPriceFeedAddress = AVAX_PRICE_FEED_ADDRESS(1);

  const { data: avaxPrice } = useReadContract({
    address: avaxPriceFeedAddress,
    abi: ChainLinkAggregatorV3InterfaceABI,
    functionName: 'latestRoundData',
    chainId: 1,
  });

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

    promises.push({
      address: zeroAddress,
      chain: 43114, // AVAX
      decimals: 18,
      price:
        Array.isArray(avaxPrice) &&
        Number(toNormalizedBn(avaxPrice[1] as number, 8).normalized),
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
