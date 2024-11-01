import Image from 'next/image';

import type { IColumn } from '@/utils/types';
import type { IWSTokenEntry } from '@augustdigital/sdk';

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
import AssetDisplay from '../atoms/asset-display';
import Background from '../atoms/background';
import RewardDistributorActionsMolecule from './actions-reward-distributor';

const columns: readonly IColumn[] = [
  {
    id: 'stakedPositionDetail',
    value: 'Staking Position',
    minWidth: 180,
    component: ({ children }: { children?: IWSTokenEntry }) => {
      if (!children)
        return (
          <TableCell>
            <Skeleton variant="text" height={36} />
          </TableCell>
        );
      return (
        <TableCell>
          <AssetDisplay
            img={`/img/tokens/${children.symbol}.svg`}
            imgSize={20}
            symbol={children.symbol}
            address={children.address}
            chainId={children?.chain}
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
                  src={`/img/chains/${children?.[0] && children?.[0] !== '-' ? children[0] : FALLBACK_CHAINID}.svg`}
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
    id: 'stakingToken',
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
                img={`/img/tokens/${children.symbol}.svg`}
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
    id: 'stakingToken',
    value: 'Total Supply',
    align: 'right',
    minWidth: 200,
    format: (value: number) => value.toLocaleString('en-US'),
    component: ({ children }: { children?: any }) => {
      if (!children.totalSupply)
        return (
          <TableCell>
            <Skeleton variant="text" height={36} />
          </TableCell>
        );
      return (
        <TableCell>
          <Stack alignItems="end">
            <AmountDisplay symbol={children?.symbol} round usd>
              {children?.totalSupply?.normalized || '-'}
            </AmountDisplay>
          </Stack>
        </TableCell>
      );
    },
  },
];

export default function RewardDistributorTableOrganism({
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
  return (
    <Box>
      {title ? (
        <Typography variant="h6" mb={{ xs: 0, md: 1 }}>
          {title}
        </Typography>
      ) : null}
      <TableMolecule
        columns={columns}
        data={data}
        uidKey="address"
        loading={loading}
        action={(rowData) =>
          RewardDistributorActionsMolecule({
            stakingToken: rowData,
            type: 'staking',
          })
        }
        pagination={pagination}
        emptyText="No Staking Positions"
        disableRowClick={true}
        sideEffects={data[0]?.stakingToken?.totalStaked?.normalized}
      />
    </Box>
  );
}
