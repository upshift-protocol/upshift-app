import useFetcher from '@/hooks/use-fetcher';
import OverviewStatsMolecule from '@/ui/molecules/overview-stats';
import PoolsTableOrganism from '@/ui/organisms/pools-table';
import MyPositionsTableOrganism from '@/ui/organisms/positions-table';
import Base from '@/ui/skeletons/base';
import Section from '@/ui/skeletons/section';
import type { IPoolWithUnderlying } from '@augustdigital/sdk';
import { Stack } from '@mui/material';
import type { UseQueryResult } from '@tanstack/react-query';

const HomePage = () => {
  const { data: allPools, isLoading: allPoolsLoading } = useFetcher({
    queryKey: ['lending-pools'],
  }) as UseQueryResult<IPoolWithUnderlying[]>;

  const { data: positions, isLoading: positionsLoading } = useFetcher({
    queryKey: ['my-positions'],
  }) as UseQueryResult<any>;

  return (
    <Base>
      <Section
        id="earn-table"
        title="Earn"
        description="Earn yields from real institutional loans via the Lazarev protocol. Democratizing high-yield investments traditionally limited to financial institutions."
        action={<OverviewStatsMolecule pools={allPools} />}
      >
        <Stack gap={3}>
          <MyPositionsTableOrganism
            title="My Positions"
            data={positions}
            loading={positionsLoading}
          />
          <PoolsTableOrganism
            title="All Pools"
            data={allPools}
            loading={allPoolsLoading}
          />
        </Stack>
      </Section>
    </Base>
  );
};

export default HomePage;
