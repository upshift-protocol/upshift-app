import type { IColumn } from '@/utils/types';

import Typography from '@mui/material/Typography';
import TableCell from '@mui/material/TableCell';
import Stack from '@mui/material/Stack';
import Skeleton from '@mui/material/Skeleton';
import Tooltip from '@mui/material/Tooltip';

import { getChainNameById } from '@/utils/helpers/ui';
import type { IWSTokenEntry } from '@augustdigital/sdk';
import { round } from '@augustdigital/sdk';
import Image from 'next/image';
import { FALLBACK_CHAINID } from '@/utils/constants/web3';
import { Paper, useTheme } from '@mui/material';
import { useThemeMode } from '@/stores/theme';
import TableMolecule from '../molecules/table';
import AmountDisplay from '../atoms/amount-display';
import AssetDisplay from '../atoms/asset-display';
import Background from '../atoms/background';
import RewardDistributorActionsMolecule from './actions-reward-distributor';

const columns: readonly IColumn[] = [
  {
    id: 'stakedPositionDetail',
    value: 'Staked Token',
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
    id: 'stakingToken',
    value: 'Total Staked',
    flex: 2,
    align: 'right',
    format: (value: number) => round(value),
    component: ({ children }: { children: any }) => {
      console.log(children, 'stakingToken');
      if (!children)
        return (
          <TableCell>
            <Skeleton variant="text" height={36} />
          </TableCell>
        );
      return (
        <TableCell>
          <Stack alignItems="end">
            <AmountDisplay symbol={children.symbol} round usd>
              {children?.totalStaked?.normalized || '-'}
            </AmountDisplay>
          </Stack>
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
            <Background color="white" variant="circular">
              <Tooltip
                title={getChainNameById(children?.[0])}
                arrow
                placement="top"
              >
                <Image
                  src={`/img/chains/${children?.[0] && children?.[0] !== '-' ? children[0] : FALLBACK_CHAINID}.svg`}
                  alt={children?.[0]}
                  height={20}
                  width={20}
                />
              </Tooltip>
            </Background>
          </Stack>
        </TableCell>
      );
    },
  },
  {
    id: 'rewardToken',
    value: 'Reward Token',
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
    id: 'apy',
    value: 'APY',
    flex: 1,
    align: 'right',
    format: (value: number) => value.toFixed(2),
    component: ({ children }: any) => {
      if (!children?.props?.children)
        return (
          <TableCell>
            <Skeleton variant="text" height={36} />
          </TableCell>
        );
      const { children: subchildren } = children.props;
      return (
        <TableCell>
          <Stack alignItems="end">
            <AmountDisplay>
              {subchildren ? `${subchildren[0]} ${subchildren[1]}` : '-'}
            </AmountDisplay>
          </Stack>
        </TableCell>
      );
    },
  },
  {
    id: 'rewardToken',
    value: 'Claimable',
    flex: 2,
    align: 'right',
    format: (value: number) => round(value),
    component: ({ children }: any) => {
      if (!children)
        return (
          <TableCell>
            <Skeleton variant="text" height={36} />
          </TableCell>
        );
      return (
        <TableCell>
          <Stack alignItems="end">
            <AmountDisplay symbol={children?.symbol} round usd>
              {children?.redeemable?.normalized || '-'}
            </AmountDisplay>
          </Stack>
        </TableCell>
      );
    },
  },
];

export default function MyActiveStakingOrganism({
  title,
  data,
  loading,
}: {
  title?: string;
  data?: any;
  loading?: number;
  refetchActiveStaking?: () => void;
}) {
  const { palette } = useTheme();
  const { isDark } = useThemeMode();

  return (
    <Paper
      sx={{
        px: 4,
        py: 3,
        bgcolor: isDark ? palette.grey[900] : palette.grey[100],
      }}
      variant="outlined"
    >
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
        action={(rowData: any) =>
          RewardDistributorActionsMolecule({
            stakingToken: rowData,
            type: 'unstaking',
          })
        }
        pagination={false}
        emptyText="No positions available"
        disableRowClick={true}
        sideEffects={[
          data[0]?.stakingToken?.totalStaked?.normalized,
          data[0]?.rewardToken?.redeemable?.normalized,
        ]}
      />
    </Paper>
  );
}
