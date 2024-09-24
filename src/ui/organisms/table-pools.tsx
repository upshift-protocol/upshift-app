import Image from 'next/image';

import type { IColumn } from '@/utils/types';
import type { IWSTokenEntry, IPoolWithUnderlying } from '@augustdigital/sdk';
import type { UseQueryResult } from '@tanstack/react-query';

import useFetcher from '@/hooks/use-fetcher';

import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import TableCell from '@mui/material/TableCell';
import Stack from '@mui/material/Stack';
import Skeleton from '@mui/material/Skeleton';
import Tooltip from '@mui/material/Tooltip';
import { FALLBACK_CHAINID } from '@/utils/constants/web3';
import { getChainNameById } from '@/utils/helpers/ui';
import AmountDisplay from '../atoms/amount-display';
import TableMolecule from '../molecules/table';
import PoolActionsMolecule from './actions-pool';
import AssetDisplay from '../atoms/asset-display';
import Background from '../atoms/background';

const columns: readonly IColumn[] = [
  { id: 'name', value: 'Name', minWidth: 180 },
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
            <Skeleton variant="circular" height={36} width={36} />
          </TableCell>
        );
      return (
        <TableCell>
          <Stack justifyContent={'center'}>
            <Background color="white" variant="circular">
              <Tooltip
                title={getChainNameById(children?.[0])}
                arrow
                placement="top"
              >
                <Image
                  src={`/chains/${children?.[0] && children?.[0] !== '-' ? children[0] : FALLBACK_CHAINID}.svg`}
                  alt={children?.[0]}
                  height={22}
                  width={22}
                />
              </Tooltip>
            </Background>
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
      if (!children)
        return (
          <TableCell>
            <Skeleton variant="text" height={36} />
          </TableCell>
        );
      return (
        <TableCell>
          <Stack alignItems="end">
            <AmountDisplay symbol={children?.[2]} round usd>
              {children?.[0] || '-'}
            </AmountDisplay>
          </Stack>
        </TableCell>
      );
    },
  },
  {
    // id: 'apy',
    id: 'hardcodedApy',
    value: 'Avg. APY',
    minWidth: 100,
    align: 'right',
    // format: (value: number) => value.toFixed(2),
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
            {/* <AmountDisplay>
              {children?.[0] && children?.[0] !== '-'
                ? `${children?.[0]}%`
                : '-'}
            </AmountDisplay> */}
            <AmountDisplay>
              {children && children !== '-' ? `${children}` : '-'}
            </AmountDisplay>
          </Stack>
        </TableCell>
      );
    },
  },
  {
    id: 'underlying',
    value: 'Deposit Token',
    flex: 2,
    component: ({ children }: { children?: IWSTokenEntry }) => {
      if (!children?.symbol)
        return (
          <TableCell>
            <Stack alignItems="center" gap={1} direction="row">
              <Skeleton variant="circular" height={24} width={24} />
              <Skeleton variant="text" height={36} width={48} />
            </Stack>
          </TableCell>
        );
      return (
        <TableCell>
          <Stack alignItems="start">
            <div onClick={(e) => e.stopPropagation()}>
              <AssetDisplay
                img={`/assets/tokens/${children.symbol}.png`}
                imgSize={20}
                symbol={children.symbol}
                address={children.address}
                chainId={children?.chain}
              />
            </div>
          </Stack>
        </TableCell>
      );
    },
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
        <Typography variant="h6" mb={{ xs: 0, md: 1 }}>
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
