import { INFURA_API_KEY } from '@/utils/constants';
import type { IAddress, IChainId } from '@augustdigital/sdk';
import {
  ABI_LENDING_POOLS,
  getLendingPool,
  getLendingPools,
  toNormalizedBn,
} from '@augustdigital/sdk';
import type { UndefinedInitialDataOptions } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import { isAddress } from 'viem';
import { readContract } from 'viem/actions';
import { useAccount, useChainId, usePublicClient } from 'wagmi';

type IFetchTypes = 'lending-pools' | 'lending-pool';

interface IUseFetcher extends UndefinedInitialDataOptions {
  queryKey: (IFetchTypes | string)[];
  initialData?: any;
  disabled?: boolean;
  formatter?: (data: any) => any;
}

export default function useFetcher({
  queryKey,
  formatter,
  ...props
}: IUseFetcher) {
  const { address: wallet } = useAccount();
  const provider = usePublicClient();
  const chain = useChainId();
  const infuraOptions = {
    chainId: chain as IChainId,
    apiKey: INFURA_API_KEY,
  };

  const type = queryKey?.[0];
  const address = queryKey?.[1];

  async function determineGetter() {
    switch (type) {
      case 'lending-pool': {
        if (!(address && isAddress(address) && provider)) {
          console.error('Second query key in array must be an address');
          return null;
        }
        return getLendingPool(address as IAddress, infuraOptions);
      }
      case 'lending-pools': {
        return getLendingPools(infuraOptions);
      }
      case 'my-positions': {
        const pools = await getLendingPools(infuraOptions);
        const promises = await Promise.all(
          pools.map(async (pool) => {
            let balance = toNormalizedBn(0);
            if (provider && wallet) {
              const bal = await readContract(provider, {
                account: wallet,
                address: pool.address,
                abi: ABI_LENDING_POOLS,
                functionName: 'balanceOf',
                args: [wallet],
              });
              balance = toNormalizedBn(bal, pool.decimals);
            }
            return {
              ...pool,
              token: pool?.underlying?.symbol,
              position: pool?.name,
              apy: '',
              walletBalance: balance.normalized,
            };
          }),
        );
        return promises.filter(
          (promise) =>
            promise.walletBalance &&
            BigInt(promise.walletBalance) > BigInt('0'),
        );
      }
      default: {
        return getLendingPools(infuraOptions);
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
    queryKey,
    queryFn: masterGetter,
  });

  return query;
}
