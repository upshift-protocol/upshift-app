import useFetcher from '@/hooks/use-fetcher';
import OverviewStatsMolecule from '@/ui/molecules/overview-stats';
import PoolsTableOrganism from '@/ui/organisms/table-pools';
import MyPositionsTableOrganism from '@/ui/organisms/table-positions';
import Base from '@/ui/skeletons/base';
import Section from '@/ui/skeletons/section';
import type { IPoolWithUnderlying } from '@augustdigital/sdk';
import { Collapse, Stack } from '@mui/material';
import type { UseQueryResult } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';

const HomePage = () => {
  const { address } = useAccount();
  const [walletConnected, setWalletConnected] = useState(false);

  const { data: allPools, isLoading: allPoolsLoading } = useFetcher({
    queryKey: ['lending-pools'],
  }) as UseQueryResult<IPoolWithUnderlying[]>;

  const { data: positions, isLoading: positionsLoading } = useFetcher({
    queryKey: ['my-positions'],
    wallet: address,
    enabled: walletConnected,
  }) as UseQueryResult<any>;

  useEffect(() => {
    if (address) setWalletConnected(true);
    else setWalletConnected(false);
  }, [address]);

  return (
    <Base>
      <Section
        id="earn-table"
        description="Upshift pools generate yields from institutional loans on the August protocol."
        action={
          <OverviewStatsMolecule loading={+allPoolsLoading} pools={allPools} />
        }
      >
        <Stack gap={{ xs: 3, sm: 3, md: 4, lg: 5, xl: 6 }}>
          <Collapse in={walletConnected && Boolean(positions?.length)}>
            <MyPositionsTableOrganism
              title="My Positions"
              data={positions}
              loading={+positionsLoading}
            />
          </Collapse>
          <PoolsTableOrganism
            title="Upshift Pools"
            data={allPools?.filter(
              (p) => !p.name?.toLowerCase()?.includes('kelp'),
            )}
            loading={+allPoolsLoading}
            pagination={false}
          />
          <PoolsTableOrganism
            title="Partner Pools"
            data={allPools?.filter((p) =>
              p.name?.toLowerCase()?.includes('kelp'),
            )}
            loading={+allPoolsLoading}
            pagination={false}
          />
        </Stack>
      </Section>
    </Base>
  );
};

export default HomePage;
