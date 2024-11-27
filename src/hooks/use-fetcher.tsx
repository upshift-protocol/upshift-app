import { augustSdk } from '@/config/august-sdk';
import { DEVELOPMENT_MODE } from '@/utils/constants';
import { buildQueryKey } from '@/utils/helpers/query';
import type {
  IAddress,
  IChainId,
  IPoolWithUnderlying,
} from '@augustdigital/sdk';
import type { UndefinedInitialDataOptions } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import { isAddress } from 'viem';
import { useChainId } from 'wagmi';

type IFetchTypes =
  | 'lending-pools'
  | 'lending-pool'
  | 'loans'
  | 'price'
  | 'my-positions'
  | 'all-prices';

interface IUseFetcher extends UndefinedInitialDataOptions {
  queryKey: (IFetchTypes | string)[];
  initialData?: any;
  enabled?: boolean;
  formatter?: (data: any) => any;
  wallet?: IAddress;
  pool?: IPoolWithUnderlying;
}

export default function useFetcher({
  queryKey,
  formatter,
  wallet,
  initialData,
  ...props
}: IUseFetcher) {
  const connectedChainId = useChainId();

  const type = queryKey?.[0];
  const poolAddressOrSymbol = queryKey?.[1];
  const chainId = queryKey?.[2] || connectedChainId;

  async function determineGetter() {
    switch (type) {
      case 'lending-pool': {
        if (!(poolAddressOrSymbol && isAddress(poolAddressOrSymbol))) {
          if (DEVELOPMENT_MODE)
            console.warn(
              '#useFetcher::lending-pool:second query key in array must be an address',
              poolAddressOrSymbol,
            );
          return null;
        }
        const pool = await augustSdk.pools.getPool(
          props?.pool ? props?.pool : poolAddressOrSymbol,
          Number(chainId) as IChainId,
        );
        return pool;
      }
      case 'loans': {
        if (!Array.isArray(initialData)) {
          console.error(
            '#useFetcher: initial data passed as args must be a valid array',
          );
          return [];
        }
        const loans = await Promise.all(
          initialData?.map((p: IPoolWithUnderlying) =>
            augustSdk.pools.getPoolLoans(p.address, p.chainId as IChainId),
          ),
        );
        return loans;
      }
      case 'lending-pools': {
        const pools = await augustSdk.pools.getPools(
          {
            loans: false,
            allocations: false,
          },
          initialData,
        );
        return pools;
      }
      case 'my-positions': {
        if (!(wallet && isAddress(wallet))) {
          if (DEVELOPMENT_MODE)
            console.warn(
              '#useFetcher::my-positions:connected address is undefined',
              wallet,
            );
          return [];
        }
        const positions = await augustSdk.pools.getAllPositions(wallet);
        return positions;
      }
      case 'price': {
        if (!poolAddressOrSymbol) {
          if (DEVELOPMENT_MODE)
            console.warn(
              '#useFetcher::price:query[1] is undefined',
              poolAddressOrSymbol,
            );
          return 1;
        }
        const price = await augustSdk.getPrice(poolAddressOrSymbol);
        return price;
      }
      default: {
        const pools = await augustSdk.pools.getPools();
        return pools;
      }
    }
  }

  const masterGetter = async () => {
    if (typeof formatter !== 'undefined')
      return formatter(await determineGetter());
    return determineGetter();
  };

  const query = useQuery({
    ...props,
    queryKey: buildQueryKey(queryKey.join('-'), '', wallet),
    queryFn: masterGetter,
  });

  return query;
}
