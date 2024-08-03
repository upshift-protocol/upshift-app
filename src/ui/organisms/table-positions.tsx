import type { IColumn } from '@/utils/types';
import { Box, Chip, TableCell, Typography } from '@mui/material';
import type { UseQueryResult } from '@tanstack/react-query';
import useFetcher from '@/hooks/use-fetcher';
import { renderVariant } from '@/utils/helpers/ui';
import { round } from '@augustdigital/sdk';
import TableMolecule from '../molecules/table';
import PoolActionsMolecule from './actions-pool';

const columns: readonly IColumn[] = [
  { id: 'token', value: 'Token', flex: 2 },
  {
    id: 'status',
    value: 'Status',
    flex: 1,
    component: ({
      children: {
        props: { children },
      },
    }: any) => {
      if (!children) return <></>;
      return (
        <TableCell>
          <Chip
            label={String(children)}
            color={renderVariant(children)}
            variant="outlined"
          />
        </TableCell>
      );
    },
  },
  { id: 'position', value: 'Position', align: 'right', flex: 2 },
  {
    id: 'apy',
    value: 'Net APY',
    flex: 1,
    align: 'right',
    format: (value: number) => round(value),
  },
  {
    id: 'walletBalance',
    value: 'Supplied',
    flex: 2,
    align: 'right',
    format: (value: number) => round(value),
  },
  {
    id: 'redeemable',
    value: 'Redeemable',
    flex: 2,
    align: 'right',
    format: (value: number) => round(value),
  },
];

export default function MyPositionsTableOrganism({
  title,
  data,
  loading,
}: {
  title?: string;
  data?: any;
  loading?: number;
}) {
  const { data: positions, isLoading: positionsLoading } = useFetcher({
    queryKey: ['my-positions'],
    enabled: typeof data === 'undefined' && !loading,
  }) as UseQueryResult<any>;

  return (
    <Box>
      {title ? (
        <Typography variant="h6" mb={1}>
          {title}
        </Typography>
      ) : null}
      <TableMolecule
        columns={columns}
        data={data ?? positions}
        uidKey="address"
        loading={loading ?? +positionsLoading}
        action={(rowData: any) => PoolActionsMolecule({ pool: rowData })}
        pagination={false}
      />
    </Box>
  );
}
