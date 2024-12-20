import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAccount, useReadContract, useReadContracts } from 'wagmi';
import { erc20Abi, zeroAddress } from 'viem';
import { avalanche } from 'viem/chains';
import { usePricesStore } from '@/stores/prices';
import {
  toNormalizedBn,
  REWARD_DISTRIBUTOR_ADDRESS,
  ABI_REWARD_DISTRIBUTOR,
} from '@augustdigital/sdk';
import type { IActiveStakePosition } from '@/utils/types';
import type { IAddress } from '@augustdigital/sdk';

interface StakingContextProps {
  stakingPositions: IActiveStakePosition[];
  refetchActiveStaking: () => void;
  isLoading: boolean;
  activeStakingLoading: boolean;
  tokenMetaLoading: boolean;
  tokenMetaPending: boolean;
}

const StakingContext = createContext<StakingContextProps | undefined>(
  undefined,
);

export const StakingProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { address } = useAccount();
  const { prices } = usePricesStore();

  const REWARDS_CHAIN = avalanche.id;
  const REWARDS_SYMBOL = avalanche.nativeCurrency.symbol;
  const rewardDistributorAddress = REWARD_DISTRIBUTOR_ADDRESS(REWARDS_CHAIN);

  const [stakingPositions, setStakingPositions] = useState<
    IActiveStakePosition[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);

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
        args: [address],
        chainId: REWARDS_CHAIN,
      },
    ],
  });

  useEffect(() => {
    if (activeStaking && stakeTokenMeta) {
      const symbol = stakeTokenMeta[1]?.result;
      const name = stakeTokenMeta[2]?.result;
      const decimals = stakeTokenMeta[0]?.result;

      const totalSupply = toNormalizedBn(
        stakeTokenMeta[3]?.result as bigint,
        decimals,
      );
      const totalStaked = toNormalizedBn(
        activeStaking[1]?.result as bigint,
        decimals,
      );
      const stakedInPool = toNormalizedBn(
        totalStakedInPool as bigint,
        decimals,
      );
      const rewardsPerSecond = toNormalizedBn(
        activeStaking[0]?.result as bigint,
        18,
      );

      const avaxPrice =
        prices?.data?.find((p) => p.symbol === REWARDS_SYMBOL)?.price || 1;
      const avaxPriceInUSD = toNormalizedBn(String(avaxPrice));

      const rewardEarned = toNormalizedBn(
        activeStaking[2]?.result as bigint,
        18,
      );

      const STAKED_APR =
        ((Number(rewardsPerSecond.normalized) *
          31536000 *
          Number(avaxPriceInUSD.normalized)) /
          (Number(stakedInPool.normalized) || 1)) *
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
      setIsLoading(false);
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
    <StakingContext.Provider
      value={{
        stakingPositions,
        refetchActiveStaking,
        isLoading,
        activeStakingLoading,
        tokenMetaLoading,
        tokenMetaPending,
      }}
    >
      {children}
    </StakingContext.Provider>
  );
};

export const useStaking = () => {
  const context = useContext(StakingContext);
  if (!context) {
    throw new Error('useStaking must be used within a StakingProvider');
  }
  return context;
};
