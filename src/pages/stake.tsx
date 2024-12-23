import Section from '@/ui/skeletons/section';
import { Collapse, Stack } from '@mui/material';
import React from 'react';
import { useAccount } from 'wagmi';
import RewardDistributorTableOrganism from '@/ui/organisms/table-reward-distributor';

import MyActiveStakingOrganism from '@/ui/organisms/table-active-staking';

import BaseSkeleton from '@/ui/skeletons/base';
import useRewardDistributor from '@/hooks/use-reward-distributor';

const StakePage = () => {
  const { address } = useAccount();

  const { stakingPositions, isLoading, isActivePositions } =
    useRewardDistributor();

  return (
    <BaseSkeleton>
      <Section
        id="stake-table"
        title="Stake"
        description="Stake your Upshift LP tokens to earn further partner incentives."
      >
        <Stack gap={{ xs: 3, sm: 3, md: 4, lg: 5, xl: 6 }}>
          <Collapse
            in={address && stakingPositions.length > 0 && isActivePositions()}
          >
            <MyActiveStakingOrganism
              title="My Positions"
              data={stakingPositions.filter(
                (position) =>
                  Number(position.stakingToken.totalStaked.normalized) > 0,
              )}
              loading={+isLoading}
            />
          </Collapse>
          <RewardDistributorTableOrganism
            title="Stake Upshift LP Tokens"
            data={stakingPositions}
            loading={+isLoading}
            pagination={false}
          />
        </Stack>
      </Section>
    </BaseSkeleton>
  );
};

export default StakePage;
