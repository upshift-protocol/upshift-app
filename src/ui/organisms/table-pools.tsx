import type { IColumn } from '@/utils/types';
import { Box, Typography, TableCell, Stack, Tooltip } from '@mui/material';
import type { UseQueryResult } from '@tanstack/react-query';
import { type IPoolWithUnderlying } from '@augustdigital/sdk';
import useFetcher from '@/hooks/use-fetcher';
import Image from 'next/image';
import PoolActionsMolecule from './actions-pool';
import TableMolecule from '../molecules/table';
import AmountDisplay from '../atoms/amount-display';

const columns: readonly IColumn[] = [
  { id: 'name', value: 'Name', minWidth: 200 },
  {
    id: 'chainId',
    value: 'Chain',
    minWidth: 50,
    format: (value: number) => value.toString(),
    component: ({
      children: {
        props: { children },
      },
    }: any) => {
      if (!children) return <></>;
      return (
        <TableCell>
          <Stack justifyContent={'center'}>
            <Tooltip title={children?.[0]} arrow placement="top">
              <Image
                src={`/chains/${children?.[0]}.svg`}
                alt={children?.[0]}
                height={20}
                width={20}
              />
            </Tooltip>
          </Stack>
        </TableCell>
      );
    },
  },
  {
    id: 'totalSupply',
    value: 'Total Supply',
    align: 'right',
    minWidth: 200,
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
              {children?.[0] || '-'}
            </AmountDisplay>
          </Stack>
        </TableCell>
      );
    },
  },
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
    flex: 2,
    align: 'right',
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
  pagination,
}: {
  title?: string;
  data?: any;
  loading?: number;
  pagination?: boolean;
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
        pagination={pagination}
      />
    </Box>
  );
}
