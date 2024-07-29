import type { IColumn } from '@/utils/types';
import { Box, Typography } from '@mui/material';
import type { UseQueryResult } from '@tanstack/react-query';
import type { IPoolWithUnderlying } from '@augustdigital/sdk';
import useFetcher from '@/hooks/use-fetcher';
import PoolActionsMolecule from '../molecules/pool-actions';
import TableMolecule from '../molecules/table';

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

export default function PoolsTableOrganism({
  title,
  data,
  loading,
}: {
  title?: string;
  data?: any;
  loading?: number;
}) {
  const { data: allPools, isLoading: allPoolsLoading } = useFetcher({
    queryKey: ['lending-pools'],
    enabled: typeof data === 'undefined' && !loading,
  }) as UseQueryResult<IPoolWithUnderlying[]>;

  return (
    <Box>
      {title ? (
        <Typography variant="h6" mb={1}>
          {title}
        </Typography>
      ) : null}
      <TableMolecule
        columns={columns}
        data={data ?? allPools}
        uidKey="address"
        loading={loading ?? +allPoolsLoading}
        action={(rowData) => PoolActionsMolecule({ pool: rowData })}
      />
    </Box>
  );
}
