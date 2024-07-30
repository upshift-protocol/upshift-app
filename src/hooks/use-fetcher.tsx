import { INFURA_API_KEY } from '@/utils/constants';
import { fromUnixTime } from '@/utils/helpers/time';
import type { IAddress, IChainId } from '@augustdigital/sdk';
import {
  ABI_LENDING_POOLS,
  getLendingPool,
  getLendingPools,
  toNormalizedBn,
} from '@augustdigital/sdk';
import type { UndefinedInitialDataOptions } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
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
            const availableRedemptions = [];
            if (provider && wallet) {
              const [bal, ...rest] = await Promise.all([
                readContract(provider, {
                  account: wallet,
                  address: pool.address,
                  abi: ABI_LENDING_POOLS,
                  functionName: 'balanceOf',
                  args: [wallet],
                }),
                readContract(provider, {
                  account: wallet,
                  address: pool.address,
                  abi: ABI_LENDING_POOLS,
                  functionName: 'getWithdrawalEpoch',
                  args: [],
                }),
                readContract(provider, {
                  account: wallet,
                  address: pool.address,
                  abi: ABI_LENDING_POOLS,
                  functionName: 'liquidationHour',
                  args: [],
                }),
                readContract(provider, {
                  account: wallet,
                  address: pool.address,
                  abi: ABI_LENDING_POOLS,
                  functionName: 'maxRedeem',
                  args: [wallet],
                }),
                readContract(provider, {
                  account: wallet,
                  address: pool.address,
                  abi: ABI_LENDING_POOLS,
                  functionName: 'lagDuration',
                  args: [],
                }),
                readContract(provider, {
                  account: wallet,
                  address: pool.address,
                  abi: ABI_LENDING_POOLS,
                  functionName: 'getBurnableAmountByReceiver',
                  args: [BigInt(2024), BigInt(7), BigInt(25), wallet],
                }),
                readContract(provider, {
                  account: wallet,
                  address: pool.address,
                  abi: ABI_LENDING_POOLS,
                  functionName: 'getClaimableAmountByReceiver',
                  args: [BigInt(2024), BigInt(7), BigInt(25), wallet],
                }),
                readContract(provider, {
                  account: wallet,
                  address: pool.address,
                  abi: ABI_LENDING_POOLS,
                  functionName: 'getScheduledTransactionsByDate',
                  args: [BigInt(2024), BigInt(7), BigInt(31)],
                }),
              ]);
              console.log('');
              console.log('getWithdrawalEpoch:', rest?.[0]);
              console.log('liquidationHour:', rest?.[1]);
              console.log('maxRedeem:', rest?.[2]);
              console.log('lagDuration:', rest?.[3]);
              console.log('getBurnableAmountByReceiver:', rest?.[4]);
              console.log('getClaimableAmountByReceiver:', rest?.[5]);
              console.log('getScheduledTransactionsByDate:', rest?.[6]);

              if (rest?.[6]?.length) {
                const unixTimestamps = rest[6];

                availableRedemptions.push(
                  [
                    ...unixTimestamps.filter(
                      (bnUnix) => bnUnix > BigInt(0) && bnUnix,
                    ),
                  ].map((unix) => fromUnixTime(Number(unix))),
                );
              }
              balance = toNormalizedBn(bal, pool.decimals);
            }
            console.log('availableRedemptions:', availableRedemptions);
            return {
              ...pool,
              token: pool?.underlying?.symbol,
              position: pool?.name,
              apy: '',
              status: 'PENDING',
              availableRedemptions,
              walletBalance: balance.normalized,
            };
          }),
        );
        // TODO: optimize to not use JS number class
        const filtered = promises.filter(
          (promise) =>
            promise.walletBalance &&
            Number(promise.walletBalance) > Number('0'),
        );
        return filtered;
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

  // TODO: not working
  useEffect(() => {
    (async () => wallet && (await query?.refetch()))().catch(console.error);
  }, [wallet, provider]);

  return query;
}
