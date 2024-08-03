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
  }) as UseQueryResult<any>;

  useEffect(() => {
    if (address) setWalletConnected(true);
    else setWalletConnected(false);
  }, [address]);

  return (
    <Base>
      <Section
        id="earn-table"
        title="Earn"
        description="Earn yields from real institutional loans via the Olympia protocol. Democratizing high-yield investments traditionally limited to financial institutions."
        action={
          <OverviewStatsMolecule loading={+allPoolsLoading} pools={allPools} />
        }
      >
        <Stack gap={3}>
          <Collapse in={walletConnected}>
            <MyPositionsTableOrganism
              title="My Positions"
              data={positions}
              loading={+positionsLoading}
            />
          </Collapse>
          <PoolsTableOrganism
            title="All Pools"
            data={allPools}
            loading={+allPoolsLoading}
          />
        </Stack>
      </Section>
    </Base>
  );
};

export default HomePage;
