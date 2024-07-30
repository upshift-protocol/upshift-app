import type { IPoolWithUnderlying } from '@augustdigital/sdk';
import { Stack } from '@mui/material';
import { Fragment } from 'react';
import DepositModalMolecule from './modal-deposit';
import WithdrawModalMolecule from './modal-withdraw';
import RedeemModalMolecule from './modal-redeem';

export default function PoolActionsMolecule({
  pool,
  gap,
}: {
  pool: IPoolWithUnderlying;
  gap?: number;
}) {
  return (
    <Stack
      direction="row"
      spacing={gap ?? 2}
      alignItems="center"
      justifyContent="end"
    >
      {(pool as any)?.status === 'REDEEM' ? (
        <RedeemModalMolecule {...pool} />
      ) : (
        <Fragment>
          <DepositModalMolecule {...pool} />
          <WithdrawModalMolecule {...pool} />
        </Fragment>
      )}
    </Stack>
  );
}
