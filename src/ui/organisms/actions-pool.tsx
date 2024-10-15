import type { IPoolWithUnderlying } from '@augustdigital/sdk';
import { Stack } from '@mui/material';
import { Fragment } from 'react';
import DepositModalMolecule from './modal-deposit';
import WithdrawModalMolecule from './modal-withdraw';
import RedeemModalMolecule from './modal-redeem';

export default function PoolActionsMolecule({
  pool,
  gap,
  type,
}: {
  pool: IPoolWithUnderlying;
  gap?: number;
  type?: 'positions' | 'pools';
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
          {type !== 'positions' ? <DepositModalMolecule {...pool} /> : null}
          <WithdrawModalMolecule {...pool} />
        </Fragment>
      )}
    </Stack>
  );
}
