import type { IAddress } from '@augustdigital/sdk';
import { useQuery } from '@tanstack/react-query';
import { augustSdk } from '@/config/august-sdk';
import { usePoolsStore } from '@/stores/pools';

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
  const {
    pools: { data: allPools },
  } = usePoolsStore();

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
    return Promise.all(
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
  };

  const query = useQuery({
    queryKey: ['all-prices'],
    enabled: !!allPools && allPools?.length > 0 && (options?.enabled || true),
    queryFn: getAllPrices,
  });

  return query;
}
