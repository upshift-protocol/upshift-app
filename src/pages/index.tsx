import useRewardDistributor from '@/hooks/use-reward-distributor';
import { usePoolsStore } from '@/stores/pools';
import OverviewStatsMolecule from '@/ui/molecules/overview-stats';
import PoolsTableOrganism from '@/ui/organisms/table-pools';
import MyPositionsTableOrganism from '@/ui/organisms/table-positions';
import BaseSkeleton from '@/ui/skeletons/base';
import Section from '@/ui/skeletons/section';
import { INSTANCE } from '@/utils/constants';
import type { IPoolWithUnderlying } from '@augustdigital/sdk';
import { Collapse, Stack } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { useAccount } from 'wagmi';

const HomePage = () => {
  const { address } = useAccount();
  const [walletConnected, setWalletConnected] = useState(false);

  const {
    pools: { data: allPools, isLoading: allPoolsLoading },
    positions: { data: positions, isLoading: positionsLoading },
  } = usePoolsStore();

  const { stakingPositions } = useRewardDistributor();

  console.log(stakingPositions, 'stakingPositions');

  const filteredPools = useMemo(() => {
    const partnerPools = [
      'kelp gain',
      'lombard lbtc',
      'upshift avalanche ausd',
      'high growth eth',
      'treehouse autovault',
      'the treehouse grow vault',
      'ethena growth susde',
      'upshift avalanche avax',
    ];

    const addRewardKey = (pool: IPoolWithUnderlying) => {
      const stakePosition = stakingPositions.find(
        (stake) =>
          stake?.stakingToken?.name?.toLocaleLowerCase() ===
          pool?.name?.toLocaleLowerCase(),
      );

      console.log(stakePosition, 'stakePosition');

      if (
        ['upshift avalanche ausd', 'upshift avalanche avax'].includes(
          pool?.name?.toLowerCase(),
        )
      ) {
        return {
          ...pool,
          rewards: {
            type: stakePosition?.maxApy,
            upshift_points: true,
            additional_points: [],
          },
        };
      }
      return pool;
    };
    if (!allPools?.length) {
      return { partners: [], upshift: [], myPositions: [] };
    }
    return {
      partners: allPools
        ?.filter((p) => partnerPools.includes(p?.name?.toLowerCase()))
        ?.map((p) => addRewardKey(p))
        .sort((a, b) => {
          return BigInt(a.totalSupply.raw) < BigInt(b.totalSupply.raw) ? 1 : -1;
        }),
      upshift: allPools
        ?.filter((p) => !partnerPools.includes(p?.name?.toLowerCase()))
        .sort((a, b) => {
          // sort manually
          if (b.symbol === 'upUSD') return -1;
          return BigInt(a.totalSupply.raw) > BigInt(b.totalSupply.raw) ? 1 : -1;
        }),
      myPositions: positions?.sort((_a, b) =>
        b?.status === 'REDEEM' ? 1 : -1,
      ),
    };
  }, [JSON.stringify(allPools), JSON.stringify(positions)]);

  console.log(filteredPools, 'filteredPools');

  useEffect(() => {
    if (address) setWalletConnected(true);
    else setWalletConnected(false);
  }, [address]);

  return (
    <BaseSkeleton>
      <Section
        id="earn-table"
        description="Upshift opens access to transparent yields backed by secure risk controls. Supply, stake and access cross-chain yields. For access to other pools, please reach out."
        action={
          <OverviewStatsMolecule loading={+allPoolsLoading} pools={allPools} />
        }
      >
        <Stack gap={{ xs: 3, sm: 3, md: 4, lg: 5, xl: 6 }}>
          <Collapse in={walletConnected && Boolean(positions?.length)}>
            <MyPositionsTableOrganism
              title="My Positions"
              data={filteredPools.myPositions}
              loading={+positionsLoading}
            />
          </Collapse>
          {INSTANCE === 'default' ? (
            <PoolsTableOrganism
              title="Upshift Pools"
              data={filteredPools.upshift}
              loading={+allPoolsLoading}
              pagination={false}
            />
          ) : null}
          <PoolsTableOrganism
            title="Partner Pools"
            data={filteredPools.partners}
            loading={+allPoolsLoading}
            pagination={false}
          />
        </Stack>
      </Section>
    </BaseSkeleton>
  );
};

export default HomePage;
