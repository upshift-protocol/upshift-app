import useFetcher from '@/hooks/use-fetcher';
import type { UseQueryResult } from '@tanstack/react-query';
import type { IColumn } from '@/utils/types';
import { Stack } from '@mui/material';
import TableMolecule from '../molecules/table';
import DepositModalMolecule from '../molecules/deposit-modal';
import WithdrawModalMolecule from '../molecules/withdraw-modal';

const columns: readonly IColumn[] = [
  { id: 'name', value: 'Name', minWidth: 150 },
  { id: 'totalSupply', value: 'Total Supply', align: 'right', minWidth: 150 },
  {
    id: 'apy',
    value: 'Net APY',
    minWidth: 100,
    align: 'right',
    format: (value: number) => value.toLocaleString('en-US'),
  },
  {
    id: 'collateral',
    value: 'Collateral',
    minWidth: 100,
    align: 'right',
    format: (value: number) => value.toLocaleString('en-US'),
  },
  {
    id: 'getLoansOperator',
    value: 'Curator',
    minWidth: 100,
  },
];

export default function PoolsTableOrganism() {
  const { data, isLoading } = useFetcher({
    queryKey: ['lending-pools'],
  }) as UseQueryResult<any>;

  return (
    <TableMolecule
      columns={columns}
      data={data}
      uidKey="address"
      loading={isLoading}
      action={
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          justifyContent="end"
        >
          <DepositModalMolecule />
          <WithdrawModalMolecule />
        </Stack>
      }
    />
  );
}
