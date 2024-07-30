import type { IPoolWithUnderlying } from '@augustdigital/sdk';
import { Stack } from '@mui/material';
import DepositModalMolecule from './modal-deposit';
import WithdrawModalMolecule from './modal-withdraw';

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
