import { usePoolsStore } from '@/stores/pools';
import OverviewStatsMolecule from '@/ui/molecules/overview-stats';
import PoolsTableOrganism from '@/ui/organisms/table-pools';
import MyPositionsTableOrganism from '@/ui/organisms/table-positions';
import Base from '@/ui/skeletons/base';
import Section from '@/ui/skeletons/section';
import { INSTANCE } from '@/utils/constants';
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

  const filteredPools = useMemo(() => {
    const partnerPools = [
      'kelp gain',
      'lombard lbtc',
      'upshift avalanche ausd',
      'high growth eth',
    ];
    if (!allPools?.length) {
      return { partners: [], upshift: [], myPositions: [] };
    }
    return {
      partners: allPools
        ?.filter((p) => partnerPools.includes(p?.name?.toLowerCase()))
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

  useEffect(() => {
    if (address) setWalletConnected(true);
    else setWalletConnected(false);
  }, [address]);

  return (
    <Base>
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
    </Base>
  );
};

export default HomePage;
