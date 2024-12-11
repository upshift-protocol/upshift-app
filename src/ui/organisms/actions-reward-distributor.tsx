import { Stack } from '@mui/material';
import { Fragment } from 'react';
import type { IActiveStakePosition } from '@/utils/types';
import StakeModalMolecule from './modal-stake';
import UnStakeModalMolecule from './modal-unstake';
import ClainRewardModalMolecule from './modal-claim';

export default function RewardDistributorActionsMolecule({
  stakingToken,
  gap,
  type = 'staking',
}: {
  stakingToken: IActiveStakePosition;
  gap?: number;
  type: 'staking' | 'unstaking';
}) {
  return (
    <Stack
      direction="row"
      spacing={gap ?? 2}
      alignItems="center"
      justifyContent="end"
    >
      {type === 'staking' ? (
        <Fragment>
          <StakeModalMolecule {...stakingToken} />
        </Fragment>
      ) : (
        <Fragment>
          <UnStakeModalMolecule {...stakingToken} />
          <ClainRewardModalMolecule {...stakingToken} />
        </Fragment>
      )}
    </Stack>
  );
}
