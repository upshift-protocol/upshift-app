import type { IColumn } from '@/utils/types';
import { Box, Stack, Typography } from '@mui/material';
import type { IPoolWithUnderlying } from '@augustdigital/sdk';
import DepositModalMolecule from '../molecules/deposit-modal';
import WithdrawModalMolecule from '../molecules/withdraw-modal';
import TableMolecule from '../molecules/table';

const columns: readonly IColumn[] = [
  { id: 'token', value: 'Token', minWidth: 150 },
  { id: 'position', value: 'Position', align: 'right', minWidth: 150 },
  {
    id: 'apy',
    value: 'Net APY',
    minWidth: 100,
    align: 'right',
    format: (value: number) => value.toLocaleString('en-US'),
  },
  {
    id: 'walletBalance',
    value: 'Supplied',
    minWidth: 100,
    align: 'right',
    format: (value: number) => value.toLocaleString('en-US'),
  },
];

function PositionsTableAction(pool: IPoolWithUnderlying) {
  return (
    <Stack direction="row" spacing={2} alignItems="center" justifyContent="end">
      <DepositModalMolecule {...pool} />
      <WithdrawModalMolecule {...pool} />
    </Stack>
  );
}

export default function MyPositionsTableOrganism({
  title,
  data,
  loading,
}: {
  title?: string;
  data?: any;
  loading?: boolean;
}) {
  return (
    <Box>
      {title ? (
        <Typography variant="h6" mb={1}>
          {title}
        </Typography>
      ) : null}
      <TableMolecule
        columns={columns}
        data={data}
        uidKey="address"
        loading={loading}
        action={PositionsTableAction}
        pagination={false}
      />
    </Box>
  );
}
