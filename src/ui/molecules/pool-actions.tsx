import type { IPoolWithUnderlying } from '@augustdigital/sdk';
import { Stack } from '@mui/material';
import DepositModalMolecule from './deposit-modal';
import WithdrawModalMolecule from './withdraw-modal';

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
      <DepositModalMolecule {...pool} />
      <WithdrawModalMolecule {...pool} />
    </Stack>
  );
}
