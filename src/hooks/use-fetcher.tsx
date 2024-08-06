import { INFURA_API_KEY } from '@/utils/constants/web3';
import { getAvailableRedemptions } from '@/utils/helpers/actions';
import type { IAddress, IChainId, INormalizedNumber } from '@augustdigital/sdk';
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
        return getLendingPool(address as IAddress, infuraOptions, {
          loans: true,
        });
      }
      case 'lending-pools': {
        return getLendingPools(infuraOptions, { loans: true });
      }
      case 'my-positions': {
        const pools = await getLendingPools(infuraOptions);
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
              //   readContract(provider, {
              //     ...args,
              //     functionName: 'getWithdrawalEpoch',
              //     args: [],
              //   }),
              //   readContract(provider, {
              //     ...args,
              //     functionName: 'liquidationHour',
              //     args: [],
              //   }),
              //   readContract(provider, {
              //     ...args,
              //     functionName: 'maxRedeem',
              //     args: [wallet],
              //   }),
              //   readContract(provider, {
              //     ...args,
              //     functionName: 'lagDuration',
              //     args: [],
              //   }),
              //   readContract(provider, {
              //     ...args,
              //     functionName: 'getBurnableAmountByReceiver',
              //     args: [BigInt(2024), BigInt(7), BigInt(25), wallet],
              //   }),
              //   readContract(provider, {
              //     ...args,
              //     functionName: 'getClaimableAmountByReceiver',
              //     args: [BigInt(2024), BigInt(7), BigInt(25), wallet],
              //   }),
              //   readContract(provider, {
              //     ...args,
              //     functionName: 'getScheduledTransactionsByDate',
              //     args: [BigInt(2024), BigInt(7), BigInt(31)],
              //   }),
              // ]);
              // console.log('');
              // console.log('getWithdrawalEpoch:', rest?.[0]);
              // console.log('liquidationHour:', rest?.[1]);
              // console.log('maxRedeem:', rest?.[2]);
              // console.log('lagDuration:', rest?.[3]);
              // console.log('getBurnableAmountByReceiver:', rest?.[4]);
              // console.log('getClaimableAmountByReceiver:', rest?.[5]);
              // console.log('getScheduledTransactionsByDate:', rest?.[6]);

              // TODO: optimize with viem and remove ethers library once latest loan is deployed
              balance = toNormalizedBn(bal, pool.decimals);
            }

            const availableRedemptions = await getAvailableRedemptions(
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
        return getLendingPools(infuraOptions, { loans: true });
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
