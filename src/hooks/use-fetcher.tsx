import { INFURA_API_KEY } from '@/utils/constants';
import type { IAddress, IChainId } from '@augustdigital/sdk';
import {
  ABI_LENDING_POOLS,
  getLendingPool,
  getLendingPools,
} from '@augustdigital/sdk';
import type { UndefinedInitialDataOptions } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import { isAddress } from 'viem';
import { readContract } from 'viem/actions';
import { useChainId, usePublicClient } from 'wagmi';

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
        const pool = await getLendingPool(address as IAddress, infuraOptions);
        const loansAmount = await readContract(provider, {
          address: pool.address,
          abi: ABI_LENDING_POOLS,
          functionName: 'globalLoansAmount',
        });
        let loans: IAddress[] = [];
        if (loansAmount > BigInt(0)) {
          loans = await Promise.all(
            Array(loansAmount).map((i) =>
              readContract(provider, {
                address: pool.address,
                abi: ABI_LENDING_POOLS,
                functionName: 'loansDeployed',
                args: [i],
              }),
            ),
          );
        }
        // TODO: do something with loan addresses
        console.log('LOANS:', loansAmount, loans);
        return {
          ...pool,
          loans,
        };
      }
      case 'lending-pools': {
        return getLendingPools(infuraOptions);
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
