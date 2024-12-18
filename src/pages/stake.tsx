import Section from '@/ui/skeletons/section';
import { Collapse, Stack } from '@mui/material';
import React, { useEffect } from 'react';
import { useAccount, useReadContract, useReadContracts } from 'wagmi';
import { erc20Abi, zeroAddress } from 'viem';
import RewardDistributorTableOrganism from '@/ui/organisms/table-reward-distributor';
import type { IAddress } from '@augustdigital/sdk';
import {
  toNormalizedBn,
  REWARD_DISTRIBUTOR_ADDRESS,
  ABI_REWARD_DISTRIBUTOR,
} from '@augustdigital/sdk';
import MyActiveStakingOrganism from '@/ui/organisms/table-active-staking';
import type { IActiveStakePosition } from '@/utils/types';
import { avalanche } from 'viem/chains';
import { usePricesStore } from '@/stores/prices';
import BaseSkeleton from '@/ui/skeletons/base';

const REWARDS_CHAIN = avalanche.id;
const REWARDS_SYMBOL = avalanche.nativeCurrency.symbol;

const StakePage = () => {
  const { address } = useAccount();
  const { prices } = usePricesStore();

  const rewardDistributorAddress = REWARD_DISTRIBUTOR_ADDRESS(REWARDS_CHAIN);

  const [stakingPositions, setStakingPositions] = React.useState<
    IActiveStakePosition[]
  >([]);

  const { data: stakingToken } = useReadContract({
    address: rewardDistributorAddress,
    abi: ABI_REWARD_DISTRIBUTOR,
    functionName: 'stakingToken',
    chainId: REWARDS_CHAIN,
  });

  const { data: totalStakedInPool } = useReadContract({
    address: rewardDistributorAddress,
    abi: ABI_REWARD_DISTRIBUTOR,
    functionName: 'totalStaked',
    chainId: REWARDS_CHAIN,
  });

  const {
    data: stakeTokenMeta,
    isLoading: tokenMetaLoading,
    isPending: tokenMetaPending,
    isFetched: tokenMetaFetched,
  } = useReadContracts({
    contracts: [
      {
        address: stakingToken as `0x${string}`,
        abi: erc20Abi,
        functionName: 'decimals',
        chainId: REWARDS_CHAIN,
      },
      {
        address: stakingToken as `0x${string}`,
        abi: erc20Abi,
        functionName: 'symbol',
        chainId: REWARDS_CHAIN,
      },
      {
        address: stakingToken as `0x${string}`,
        abi: erc20Abi,
        functionName: 'name',
        chainId: REWARDS_CHAIN,
      },
      {
        address: stakingToken as `0x${string}`,
        abi: erc20Abi,
        functionName: 'totalSupply',
        chainId: REWARDS_CHAIN,
      },
    ],
  });

  const {
    data: activeStaking,
    isLoading: activeStakingLoading,
    refetch: refetchActiveStaking,
    isFetched: activeStakingFetched,
  } = useReadContracts({
    contracts: [
      {
        address: rewardDistributorAddress,
        abi: ABI_REWARD_DISTRIBUTOR,
        functionName: 'rewardsPerSecond',
        chainId: REWARDS_CHAIN,
      },
      {
        address: rewardDistributorAddress,
        abi: ABI_REWARD_DISTRIBUTOR,
        functionName: 'balanceOf',
        args: [address],
        chainId: REWARDS_CHAIN,
      },
      {
        address: rewardDistributorAddress,
        abi: ABI_REWARD_DISTRIBUTOR,
        functionName: 'earned',
        chainId: REWARDS_CHAIN,
        args: [address],
      },
    ],
  });

  useEffect(() => {
    if (activeStaking && stakeTokenMeta) {
      const symbol = stakeTokenMeta && stakeTokenMeta[1]?.result;
      const name = stakeTokenMeta && stakeTokenMeta[2]?.result;
      const decimals = stakeTokenMeta && stakeTokenMeta[0]?.result;
      const totalSupply =
        stakeTokenMeta &&
        toNormalizedBn(stakeTokenMeta[3]?.result as bigint, decimals);

      const totalStaked =
        activeStaking &&
        toNormalizedBn(activeStaking[1]?.result as bigint, decimals);
      const stakedInPool = toNormalizedBn(
        totalStakedInPool as bigint,
        decimals,
      );
      const rewardsPerSecond =
        activeStaking && toNormalizedBn(activeStaking[0]?.result as bigint, 18);

      const avaxPrice =
        prices?.data?.find((p) => p.symbol === REWARDS_SYMBOL)?.price || 1;
      const avaxPriceInUSD = avaxPrice
        ? toNormalizedBn(String(avaxPrice))
        : toNormalizedBn(0);

      const rewardEarned =
        activeStaking && toNormalizedBn(activeStaking[2]?.result as bigint, 18);
      const STAKED_APR =
        ((Number(rewardsPerSecond?.normalized) *
          31536000 *
          Number(avaxPriceInUSD?.normalized)) /
          (Number(stakedInPool?.normalized) * Number(1))) *
        100;
      const MAX_APR =
        ((Number(rewardsPerSecond?.normalized) *
          31536000 *
          Number(avaxPriceInUSD?.normalized)) /
          (Number(stakedInPool?.normalized) * Number(1))) *
        100;
      const activePosition: IActiveStakePosition = {
        id: '1',
        rewardToken: {
          decimals: 18,
          symbol: REWARDS_SYMBOL,
          address: zeroAddress,
          chain: REWARDS_CHAIN,
          redeemable: rewardEarned,
          usd: avaxPriceInUSD,
          name: 'Avalanche' as string,
        },
        stakingToken: {
          decimals: decimals as number,
          symbol: symbol as string,
          address: stakingToken as IAddress,
          chain: REWARDS_CHAIN,
          totalStaked,
          usd: avaxPriceInUSD,
          totalSupply,
          name: name as string,
        },
        rewardDistributor: rewardDistributorAddress,
        rewardPerSecond: rewardsPerSecond,
        apy: STAKED_APR,
        maxApy: MAX_APR,
        chainId: REWARDS_CHAIN,
      };
      setStakingPositions([activePosition]);
    }
  }, [
    tokenMetaLoading,
    activeStakingLoading,
    activeStaking?.[1]?.result,
    activeStakingFetched,
    tokenMetaFetched,
    prices?.isFetched,
  ]);

  return (
    <BaseSkeleton>
      <Section
        id="stake-table"
        title="Stake"
        description="Stake your Upshift LP tokens to earn further partner incentives."
      >
        <Stack gap={{ xs: 3, sm: 3, md: 4, lg: 5, xl: 6 }}>
          <Collapse
            in={
              address &&
              stakingPositions.length > 0 &&
              Number(
                stakingPositions?.[0]?.stakingToken?.totalStaked?.normalized,
              ) > 0
            }
          >
            <MyActiveStakingOrganism
              title="My Positions"
              data={stakingPositions}
              loading={+(activeStakingLoading || tokenMetaLoading)}
              refetchActiveStaking={refetchActiveStaking}
            />
          </Collapse>
          <RewardDistributorTableOrganism
            title="Stake Upshift LP Tokens"
            data={stakingPositions}
            loading={+tokenMetaLoading || +tokenMetaPending}
            pagination={false}
          />
        </Stack>
      </Section>
    </BaseSkeleton>
  );
};

export default StakePage;
