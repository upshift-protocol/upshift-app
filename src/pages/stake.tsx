import Section from '@/ui/skeletons/section';
import Base from '@/ui/skeletons/base';
import { Collapse, Stack } from '@mui/material';
import React, { useEffect } from 'react';
import {
  useAccount,
  useChainId,
  useReadContract,
  useReadContracts,
} from 'wagmi';
import { erc20Abi, zeroAddress } from 'viem';
import RewardDistributorTableOrganism from '@/ui/organisms/table-reward-distributor';
import type { IAddress } from '@augustdigital/sdk';
import {
  toNormalizedBn,
  AVAX_PRICE_FEED_ADDRESS,
  REWARD_DISTRIBUTOR_ADDRESS,
  ABI_REWARD_DISTRIBUTOR,
  ABI_CHAINLINK_V3,
} from '@augustdigital/sdk';
import MyActiveStakingOrganism from '@/ui/organisms/table-active-staking';
import type { IActiveStakePosition } from '@/utils/types';

const StakePage = () => {
  const chainId = useChainId();
  const { address, chain } = useAccount();

  const rewardDistributorAddress = REWARD_DISTRIBUTOR_ADDRESS(chainId);
  const avaxPriceFeedAddress = AVAX_PRICE_FEED_ADDRESS(1);

  const [stakingPositions, setStakingPositions] = React.useState<
    IActiveStakePosition[]
  >([]);

  const { data: stakingToken } = useReadContract({
    address: rewardDistributorAddress,
    abi: ABI_REWARD_DISTRIBUTOR,
    functionName: 'stakingToken',
    chainId,
  });

  const {
    data: stakeTokenMeta,
    isLoading: tokenMetaLoading,
    isPending: tokenMetaPending,
  } = useReadContracts({
    contracts: [
      {
        address: stakingToken as `0x${string}`,
        abi: erc20Abi,
        functionName: 'decimals',
        chainId,
      },
      {
        address: stakingToken as `0x${string}`,
        abi: erc20Abi,
        functionName: 'symbol',
        chainId,
      },
      {
        address: stakingToken as `0x${string}`,
        abi: erc20Abi,
        functionName: 'name',
        chainId,
      },
      {
        address: stakingToken as `0x${string}`,
        abi: erc20Abi,
        functionName: 'totalSupply',
        chainId,
      },
    ],
  });

  const {
    data: activeStaking,
    isLoading: activeStakingLoading,
    refetch: refetchActiveStaking,
  } = useReadContracts({
    contracts: [
      {
        address: rewardDistributorAddress,
        abi: ABI_REWARD_DISTRIBUTOR,
        functionName: 'rewardsPerSecond',
        chainId,
      },
      {
        address: rewardDistributorAddress,
        abi: ABI_REWARD_DISTRIBUTOR,
        functionName: 'balanceOf',
        args: [address],
        chainId,
      },
      {
        address: avaxPriceFeedAddress,
        abi: ABI_CHAINLINK_V3,
        functionName: 'latestRoundData',
        chainId: 1,
      },
      {
        address: rewardDistributorAddress,
        abi: ABI_REWARD_DISTRIBUTOR,
        functionName: 'earned',
        chainId,
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
      const rewardsPerSecond =
        activeStaking && toNormalizedBn(activeStaking[0]?.result as bigint, 18);

      const avaxPrice = activeStaking && activeStaking[2].result;
      const avaxPriceInUSD = avaxPrice
        ? toNormalizedBn(avaxPrice[1], 8)
        : toNormalizedBn(0);

      const rewardEarned =
        activeStaking && toNormalizedBn(activeStaking[3]?.result as bigint, 18);

      const APR =
        (Number(rewardsPerSecond?.normalized) * 31536000 * 100) /
        (Number(totalStaked?.normalized) * Number(avaxPriceInUSD?.normalized));

      const activePosition: IActiveStakePosition = {
        id: '1',
        rewardToken: {
          decimals: chain?.nativeCurrency?.decimals as number,
          symbol: chain?.nativeCurrency?.symbol as string,
          address: zeroAddress,
          chain: chainId,
          redeemable: rewardEarned,
          usd: avaxPriceInUSD,
          name: chain?.nativeCurrency?.name as string,
        },
        stakingToken: {
          decimals: decimals as number,
          symbol: symbol as string,
          address: stakingToken as IAddress,
          chain: chainId,
          totalStaked,
          usd: avaxPriceInUSD,
          totalSupply,
          name: name as string,
        },
        rewardDistributor: rewardDistributorAddress,
        rewardPerSecond: rewardsPerSecond,
        apy: APR,
        chainId,
      };

      setStakingPositions([activePosition]);
    }
  }, [tokenMetaLoading, activeStakingLoading, activeStaking?.[1]?.result]);

  return (
    <Base>
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
    </Base>
  );
};

export default StakePage;
