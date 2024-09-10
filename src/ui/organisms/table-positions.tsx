import type { IColumn } from '@/utils/types';

import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import TableCell from '@mui/material/TableCell';
import Stack from '@mui/material/Stack';
import Skeleton from '@mui/material/Skeleton';
import Tooltip from '@mui/material/Tooltip';

import type { UseQueryResult } from '@tanstack/react-query';
import useFetcher from '@/hooks/use-fetcher';
import { getChainNameById, renderVariant } from '@/utils/helpers/ui';
import { round } from '@augustdigital/sdk';
import { useAccount } from 'wagmi';
import Image from 'next/image';
import Chip from '@mui/material/Chip';
import { FALLBACK_CHAINID } from '@/utils/constants/web3';
import { FALLBACK_TOKEN_IMG } from '@/utils/constants/ui';
import TableMolecule from '../molecules/table';
import PoolActionsMolecule from './actions-pool';
import AmountDisplay from '../atoms/amount-display';
import AssetDisplay from '../atoms/asset-display';

const columns: readonly IColumn[] = [
  {
    id: 'token',
    value: 'Token',
    minWidth: 180,
    component: ({
      children: {
        props: { children },
      },
    }: any) => {
      if (!children)
        return (
          <TableCell>
            <Skeleton variant="text" height={36} />
          </TableCell>
        );
      return (
        <TableCell>
          <AssetDisplay
            symbol={String(children)}
            img={
              children && children !== '-'
                ? `/assets/tokens/${String(children)}.png`
                : FALLBACK_TOKEN_IMG
            }
          />
        </TableCell>
      );
    },
  },
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
      if (!children)
        return (
          <TableCell>
            <Skeleton variant="text" height={36} />
          </TableCell>
        );
      return (
        <TableCell>
          <Stack justifyContent={'center'}>
            <Tooltip
              title={getChainNameById(children?.[0])}
              arrow
              placement="top"
            >
              <Image
                src={`/chains/${children?.[0] && children?.[0] !== '-' ? children[0] : FALLBACK_CHAINID}.svg`}
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
    id: 'status',
    value: 'Status',
    flex: 1,
    component: ({
      children: {
        props: { children },
      },
    }: any) => {
      if (!children)
        return (
          <TableCell>
            <Skeleton variant="text" height={36} />
          </TableCell>
        );
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
    component: ({
      children: {
        props: { children },
      },
    }: any) => {
      if (!children)
        return (
          <TableCell>
            <Skeleton variant="text" height={36} />
          </TableCell>
        );
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
    id: 'redeemable',
    value: 'Redeemable',
    flex: 2,
    align: 'right',
    format: (value: number) => round(value),
    component: ({
      children: {
        props: { children },
      },
    }: any) => {
      if (!children)
        return (
          <TableCell>
            <Skeleton variant="text" height={36} />
          </TableCell>
        );
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
  const { address } = useAccount();
  const { data: positions, isLoading: positionsLoading } = useFetcher({
    queryKey: ['my-positions'],
    wallet: address,
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
        emptyText="No positions available"
      />
    </Box>
  );
}
