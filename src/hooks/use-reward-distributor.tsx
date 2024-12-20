// create a basic hook

import { usePricesStore } from '@/stores/prices';
import type { IActiveStakePosition } from '@/utils/types';
import type { IAddress, INormalizedNumber } from '@augustdigital/sdk';
import {
  ABI_REWARD_DISTRIBUTOR,
  REWARD_DISTRIBUTOR_ADDRESS,
  toNormalizedBn,
} from '@augustdigital/sdk';
import React, { useEffect } from 'react';
import type { Abi } from 'viem';
import { erc20Abi, zeroAddress } from 'viem';
import { avalanche } from 'viem/chains';
import { useAccount, useReadContracts } from 'wagmi';

const REWARDS_CHAIN = avalanche.id;
const REWARDS_SYMBOL = avalanche.nativeCurrency.symbol;

export default function useRewardDistributor() {
  const { address } = useAccount();
  const { prices } = usePricesStore();

  const rewardDistributorAddresses = REWARD_DISTRIBUTOR_ADDRESS(REWARDS_CHAIN);

  const [stakingPositions, setStakingPositions] = React.useState<
    IActiveStakePosition[]
  >([]);

  const { data: stakingTokens, isLoading: stakingTokensLoading } =
    useReadContracts({
      contracts: rewardDistributorAddresses.map((distributorAddress) => ({
        address: distributorAddress as `0x${string}`,
        abi: ABI_REWARD_DISTRIBUTOR as Abi,
        functionName: 'stakingToken',
        chainId: REWARDS_CHAIN,
      })),
    });

  const { data: totalStakedInPools, isLoading: totalStakedLoading } =
    useReadContracts({
      contracts: rewardDistributorAddresses.map((distributorAddress) => ({
        address: distributorAddress as `0x${string}`,
        abi: ABI_REWARD_DISTRIBUTOR as Abi,
        functionName: 'totalStaked',
        chainId: REWARDS_CHAIN,
      })),
    });

  const { data: decimals, isLoading: decimalsLoading } = useReadContracts({
    contracts: stakingTokens?.map((token) => {
      return {
        address: token.result as `0x${string}`,
        abi: erc20Abi,
        functionName: 'decimals',
        chainId: REWARDS_CHAIN,
      };
    }),
  });

  const { data: symbols, isLoading: symbolsLoading } = useReadContracts({
    contracts: stakingTokens?.map((token) => {
      return {
        address: token.result as `0x${string}`,
        abi: erc20Abi,
        functionName: 'symbol',
        chainId: REWARDS_CHAIN,
      };
    }),
  });

  const { data: names, isLoading: namesLoading } = useReadContracts({
    contracts: stakingTokens?.map((token) => {
      return {
        address: token.result as `0x${string}`,
        abi: erc20Abi,
        functionName: 'name',
        chainId: REWARDS_CHAIN,
      };
    }),
  });

  const { data: totalSupplies, isLoading: totalSupplyLoading } =
    useReadContracts({
      contracts: stakingTokens?.map((token) => {
        return {
          address: token.result as `0x${string}`,
          abi: erc20Abi,
          functionName: 'totalSupply',
          chainId: REWARDS_CHAIN,
        };
      }),
    });

  const {
    data: rewardPerSeconds,
    isLoading: rewardsLoading,
    refetch: rewardsRefetch,
  } = useReadContracts({
    contracts: rewardDistributorAddresses.map((distributorAddress) => ({
      address: distributorAddress as `0x${string}`,
      abi: ABI_REWARD_DISTRIBUTOR as Abi,
      functionName: 'rewardsPerSecond',
      chainId: REWARDS_CHAIN,
    })),
  });

  const {
    data: balances,
    isLoading: balancesLoading,
    refetch: balancesRefetch,
  } = useReadContracts({
    contracts: rewardDistributorAddresses.map((distributorAddress) => ({
      address: distributorAddress as `0x${string}`,
      abi: ABI_REWARD_DISTRIBUTOR as Abi,
      functionName: 'balanceOf',
      args: [address],
      chainId: REWARDS_CHAIN,
    })),
  });

  const {
    data: earned,
    isLoading: earnedLoading,
    refetch: earnedRefetch,
  } = useReadContracts({
    contracts: rewardDistributorAddresses.map((distributorAddress) => ({
      address: distributorAddress as `0x${string}`,
      abi: ABI_REWARD_DISTRIBUTOR as Abi,
      functionName: 'earned',
      chainId: REWARDS_CHAIN,
      args: [address],
    })),
  });

  const refetchActiveStaking = () => {
    rewardsRefetch();
    balancesRefetch();
    earnedRefetch();
  };

  const isActivePositions = () => {
    return stakingPositions.some(
      (position) => Number(position.stakingToken.totalStaked.normalized) > 0,
    );
  };

  const isLoading =
    stakingTokensLoading ||
    totalStakedLoading ||
    decimalsLoading ||
    symbolsLoading ||
    namesLoading ||
    totalSupplyLoading ||
    rewardsLoading ||
    balancesLoading ||
    earnedLoading;

  useEffect(() => {
    if (stakingTokens && stakingTokens.length > 0) {
      const positions = [];
      for (
        let index = 0;
        index < rewardDistributorAddresses.length;
        index += 1
      ) {
        const symbol = symbols?.[index]?.result;
        const name = names?.[index]?.result;
        const decimal = decimals?.[index]?.result;
        const totalSupply = toNormalizedBn(
          totalSupplies?.[index]?.result as bigint,
          decimal as number,
        ) as INormalizedNumber;
        const totalStaked = toNormalizedBn(
          balances?.[index]?.result as bigint,
          decimal as number,
        ) as INormalizedNumber;
        const totalStakedInPool = toNormalizedBn(
          totalStakedInPools?.[index]?.result as bigint,
          decimal as number,
        ) as INormalizedNumber;
        const rewardsPerSecond = toNormalizedBn(
          rewardPerSeconds?.[index]?.result as bigint,
          18,
        ) as INormalizedNumber;
        const rewardEarned = toNormalizedBn(
          earned?.[index]?.result as bigint,
          18,
        ) as INormalizedNumber;

        const avaxPrice =
          prices?.data?.find((p) => p.symbol === REWARDS_SYMBOL)?.price || 1;
        const avaxPriceInUSD = avaxPrice
          ? toNormalizedBn(String(avaxPrice))
          : toNormalizedBn(0);

        const STAKED_APR =
          ((Number(rewardsPerSecond?.normalized) *
            31536000 *
            Number(avaxPriceInUSD?.normalized)) /
            (Number(totalStakedInPool?.normalized) * Number(1))) *
          100;
        const MAX_APR =
          ((Number(rewardsPerSecond?.normalized) *
            31536000 *
            Number(avaxPriceInUSD?.normalized)) /
            (Number(totalStakedInPool?.normalized) * Number(1))) *
          100;

        const activePosition: IActiveStakePosition = {
          id: index.toString(),
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
            decimals: decimal as number,
            symbol: symbol as string,
            address: stakingTokens[index]?.result as IAddress,
            chain: REWARDS_CHAIN,
            totalStaked,
            usd: avaxPriceInUSD,
            totalSupply,
            name: name as string,
          },
          rewardDistributor: rewardDistributorAddresses[index] as IAddress,
          rewardPerSecond: rewardsPerSecond,
          apy: STAKED_APR,
          maxApy: MAX_APR,
          chainId: REWARDS_CHAIN,
        };

        positions.push(activePosition);
      }

      setStakingPositions(positions);
    }
  }, [
    stakingTokensLoading,
    totalStakedLoading,
    decimalsLoading,
    symbolsLoading,
    namesLoading,
    totalSupplyLoading,
    rewardsLoading,
    balancesLoading,
    earnedLoading,
    balances,
    earned,
    prices?.isFetched,
  ]);

  return {
    stakingTokens,
    refetchActiveStaking,
    isActivePositions,
    stakingPositions,
    isLoading,
  };
}
