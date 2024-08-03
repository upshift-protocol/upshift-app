import type { IColumn } from '@/utils/types';
import { Box, Typography, TableCell, Stack } from '@mui/material';
import type { UseQueryResult } from '@tanstack/react-query';
import { type IPoolWithUnderlying } from '@augustdigital/sdk';
import useFetcher from '@/hooks/use-fetcher';
import PoolActionsMolecule from './actions-pool';
import TableMolecule from '../molecules/table';
import AmountDisplay from '../atoms/amount-display';

const columns: readonly IColumn[] = [
  { id: 'name', value: 'Name', flex: 2 },
  {
    id: 'totalSupply',
    value: 'Total Supply',
    align: 'right',
    flex: 2,
    format: (value: number) => value.toLocaleString('en-US'),
    component: ({
      children: {
        props: { children },
      },
    }: any) => {
      if (!children) return <></>;
      return (
        <TableCell>
          <Stack alignItems="end">
            <AmountDisplay symbol={children?.[2]} round>
              {children?.[0]}
            </AmountDisplay>
          </Stack>
        </TableCell>
      );
    },
  },
  {
    id: 'apy',
    value: 'Net APY',
    flex: 1,
    align: 'right',
    format: (value: number) => value.toLocaleString('en-US'),
  },
  {
    id: 'collateral',
    value: 'Collateral',
    flex: 2,
    align: 'right',
    format: (value: number) => value.toLocaleString('en-US'),
  },
  {
    id: 'loansOperator',
    value: 'Strategist',
    flex: 1,
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
