import { augustSdk } from '@/config/august-sdk';
import type { INormalizedNumber } from '@augustdigital/sdk';
import { ABI_LENDING_POOLS, toNormalizedBn } from '@augustdigital/sdk';
import type { UndefinedInitialDataOptions } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import { isAddress } from 'viem';
import { readContract } from 'viem/actions';
import { useAccount, usePublicClient } from 'wagmi';

type IFetchTypes = 'lending-pools' | 'lending-pool';

interface IUseFetcher extends UndefinedInitialDataOptions {
  queryKey: (IFetchTypes | string)[];
  initialData?: any;
  enabled?: boolean;
  formatter?: (data: any) => any;
}

export default function useFetcher({
  queryKey,
  formatter,
  ...props
}: IUseFetcher) {
  const { address: wallet } = useAccount();
  const provider = usePublicClient();

  const type = queryKey?.[0];
  const address = queryKey?.[1];

  async function determineGetter() {
    switch (type) {
      case 'lending-pool': {
        if (!(address && isAddress(address) && provider)) {
          console.error('Second query key in array must be an address');
          return null;
        }
        return augustSdk.pools.getPool(address);
      }
      case 'lending-pools': {
        return augustSdk.pools.getPools();
      }
      case 'my-positions': {
        const pools = await augustSdk.pools.getPools();
        const promises = await Promise.all(
          pools.map(async (pool) => {
            let balance = toNormalizedBn(0);
            if (provider && wallet) {
              const args = {
                account: wallet,
                address: pool.address,
                abi: ABI_LENDING_POOLS,
              };
              const [bal] = await Promise.all([
                readContract(provider, {
                  ...args,
                  functionName: 'balanceOf',
                  args: [wallet],
                }),
              ]);

              // TODO: optimize with viem and remove ethers library once latest loan is deployed
              balance = toNormalizedBn(bal, pool.decimals);
            }

            const availableRedemptions =
              await augustSdk.pools.getAvailableRedemptions(
                pool.address,
                wallet,
              );

            function renderStatus() {
              if (availableRedemptions.length) return 'REDEEM';
              if (balance.raw > BigInt(0)) return 'STAKED';
              return 'PENDING';
            }
            const aggregateAvailableRedemptions = availableRedemptions.reduce(
              (acc, curr) => acc + (curr.amount as INormalizedNumber).raw,
              BigInt(0),
            );
            return {
              ...pool,
              token: pool?.underlying?.symbol,
              position: pool?.name,
              apy: '',
              status: renderStatus(),
              availableRedemptions,
              redeemable: toNormalizedBn(
                aggregateAvailableRedemptions,
                pool.decimals,
              ),
              walletBalance: balance.normalized,
            };
          }),
        );
        const filtered = promises.filter(
          (promise) => promise.status !== 'PENDING',
        );
        return filtered;
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
    queryKey,
    queryFn: masterGetter,
  });

  return query;
}
