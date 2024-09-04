import { augustSdk } from '@/config/august-sdk';
import { buildQueryKey } from '@/utils/helpers/query';
import type { IAddress } from '@augustdigital/sdk';
import type { UndefinedInitialDataOptions } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import { isAddress } from 'viem';
import { useChainId } from 'wagmi';

type IFetchTypes = 'lending-pools' | 'lending-pool' | 'price' | 'my-positions';

interface IUseFetcher extends UndefinedInitialDataOptions {
  queryKey: (IFetchTypes | string)[];
  initialData?: any;
  enabled?: boolean;
  formatter?: (data: any) => any;
  wallet?: IAddress;
}

export default function useFetcher({
  queryKey,
  formatter,
  wallet,
  ...props
}: IUseFetcher) {
  const chainId = useChainId();

  const type = queryKey?.[0];
  const poolAddressOrSymbol = queryKey?.[1];

  async function determineGetter() {
    switch (type) {
      case 'lending-pool': {
        if (!(poolAddressOrSymbol && isAddress(poolAddressOrSymbol))) {
          console.error('Second query key in array must be an address');
          return null;
        }
        return augustSdk.pools.getPool(poolAddressOrSymbol);
      }
      case 'lending-pools': {
        return augustSdk.pools.getPools();
      }
      case 'my-positions': {
        if (!(wallet && isAddress(wallet))) {
          console.error('Connected address is undefined:', wallet);
          return [];
        }
        return augustSdk.pools.getAllPositions(wallet);
      }
      case 'price': {
        if (!poolAddressOrSymbol) return 1;
        return augustSdk.getPrice(poolAddressOrSymbol);
      }
      default: {
        return augustSdk.pools.getPools();
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
    queryKey: buildQueryKey(queryKey.join('-'), chainId, wallet),
    queryFn: masterGetter,
  });

  return query;
}
