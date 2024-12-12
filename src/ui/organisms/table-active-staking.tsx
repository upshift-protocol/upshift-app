import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Skeleton from '@mui/material/Skeleton';
import Tooltip from '@mui/material/Tooltip';
import { getChainNameById } from '@/utils/helpers/ui';
import { FALLBACK_CHAINID, type IAddress } from '@augustdigital/sdk';
import Image from 'next/image';
import { Paper, useTheme } from '@mui/material';
import { useThemeMode } from '@/stores/theme';
import type { GridColDef, GridColumnHeaderParams } from '@mui/x-data-grid';
import { DataGrid } from '@mui/x-data-grid';
import {
  DATA_TABLE_OPTIONS,
  TABLE_HEADER_FONT_WEIGHT,
} from '@/utils/constants';
import AmountDisplay from '../atoms/amount-display';
import Background from '../atoms/background';
import RewardDistributorActionsMolecule from './actions-reward-distributor';
import AssetDisplay from '../molecules/asset-display';

const columns: readonly GridColDef<any[number]>[] = [
  {
    field: 'stakedToken',
    headerName: 'Staked Token',
    renderHeader: (params: GridColumnHeaderParams) => (
      <span style={{ fontWeight: TABLE_HEADER_FONT_WEIGHT }}>
        {params.colDef.headerName}
      </span>
    ),
    minWidth: 300,
    flex: 2,
    editable: false,
    renderCell({ row }) {
      const { stakingToken, chainId } = row;
      if (!row) {
        return (
          <Stack alignItems="center" gap={1} direction="row" height="100%">
            <Skeleton variant="circular" height={24} width={24} />
            <Skeleton variant="text" height={36} width={48} />
          </Stack>
        );
      }

      return (
        <Stack
          alignItems="start"
          justifyContent={'center'}
          height="100%"
          onClick={(e) => e.stopPropagation()}
        >
          <AssetDisplay
            imgSize={20}
            symbol={stakingToken.symbol}
            address={stakingToken?.address as IAddress}
            chainId={chainId ? Number(chainId) : undefined}
          />
        </Stack>
      );
    },
  },
  {
    field: 'chain',
    headerName: 'Chain',
    renderHeader: (params: GridColumnHeaderParams) => (
      <span style={{ fontWeight: TABLE_HEADER_FONT_WEIGHT }}>
        {params.colDef.headerName}
      </span>
    ),
    maxWidth: 100,
    flex: 1,
    editable: false,
    renderCell({ row }) {
      if (!row) {
        return <Skeleton variant="circular" height={36} width={36} />;
      }
      return (
        <Stack justifyContent={'center'} height="100%" alignItems="start">
          <Background color="white" variant="circular">
            <Tooltip
              title={getChainNameById(row?.chainId)}
              arrow
              placement="top"
            >
              <Image
                src={`/img/chains/${row?.chainId && row?.chainId !== '-' ? row?.chainId : FALLBACK_CHAINID}.svg`}
                alt={row?.chainId}
                height={22}
                width={22}
              />
            </Tooltip>
          </Background>
        </Stack>
      );
    },
  },
  {
    field: 'rewardToken',
    headerName: 'Reward Token',
    renderHeader: (params: GridColumnHeaderParams) => (
      <span style={{ fontWeight: TABLE_HEADER_FONT_WEIGHT }}>
        {params.colDef.headerName}
      </span>
    ),
    flex: 2,
    editable: false,
    renderCell({ row }) {
      const { rewardToken, chainId } = row;
      if (!rewardToken?.usd) {
        return (
          <Stack alignItems="center" gap={1} direction="row" height="100%">
            <Skeleton variant="circular" height={24} width={24} />
            <Skeleton variant="text" height={36} width={48} />
          </Stack>
        );
      }

      return (
        <Stack
          alignItems="start"
          onClick={(e) => e.stopPropagation()}
          height="100%"
          justifyContent={'center'}
        >
          <AssetDisplay
            imgSize={20}
            symbol={rewardToken.symbol}
            address={rewardToken?.address as IAddress}
            chainId={chainId ? Number(chainId) : undefined}
          />
        </Stack>
      );
    },
  },
  {
    field: 'totalStaked',
    headerName: 'Total Staked',
    headerAlign: 'right',
    renderHeader: (params: GridColumnHeaderParams) => (
      <span style={{ fontWeight: TABLE_HEADER_FONT_WEIGHT }}>
        {params.colDef.headerName}
      </span>
    ),
    flex: 2,
    editable: false,
    renderCell({ row }) {
      const { stakingToken } = row;
      if (!stakingToken?.usd) {
        return <Skeleton variant="text" height={36} />;
      }

      return (
        <Stack alignItems="end">
          <AmountDisplay symbol={stakingToken?.symbol} round usd>
            {stakingToken?.totalStaked?.normalized || '-'}
          </AmountDisplay>
        </Stack>
      );
    },
  },
  {
    field: 'apy',
    headerName: 'APY',
    renderHeader: (params: GridColumnHeaderParams) => (
      <span style={{ fontWeight: TABLE_HEADER_FONT_WEIGHT }}>
        {params.colDef.headerName}
      </span>
    ),
    flex: 1,
    editable: false,
    headerAlign: 'right',
    renderCell({ row }) {
      const { apy } = row;
      if (!apy) {
        return <Skeleton variant="text" height={36} />;
      }

      return (
        <Stack alignItems="end" height="100%" justifyContent={'center'}>
          <AmountDisplay>
            {apy && Number(apy) >= 1
              ? `${([apy] as string[]).join('')?.toString()?.slice(0, 5)}%`
              : '-'}
          </AmountDisplay>
        </Stack>
      );
    },
  },
  {
    field: 'claimable',
    headerName: 'Claimable',
    headerAlign: 'right',
    renderHeader: (params: GridColumnHeaderParams) => (
      <span style={{ fontWeight: TABLE_HEADER_FONT_WEIGHT }}>
        {params.colDef.headerName}
      </span>
    ),
    flex: 2,
    editable: false,
    renderCell({ row }) {
      const { rewardToken } = row;
      if (!rewardToken?.usd) {
        return <Skeleton variant="text" height={36} />;
      }
      console.log('rewardToken:', rewardToken);
      return (
        <Stack alignItems="end">
          <AmountDisplay symbol={rewardToken?.symbol} round usd>
            {rewardToken?.redeemable?.normalized || '-'}
          </AmountDisplay>
        </Stack>
      );
    },
  },
  {
    field: 'stake',
    headerName: '',
    description: '',
    disableColumnMenu: true,
    disableExport: true,
    disableReorder: true,
    editable: false,
    headerClassName: 'super-app-theme--header',
    sortable: false,
    flex: 3,
    renderHeader: (params: GridColumnHeaderParams) => (
      <span style={{ fontWeight: TABLE_HEADER_FONT_WEIGHT }}>
        {params.colDef.headerName}
      </span>
    ),
    renderCell({ row }) {
      return RewardDistributorActionsMolecule({
        stakingToken: row,
        type: 'unstaking',
      });
    },
  },
];

export default function MyActiveStakingOrganism({
  title,
  data,
  loading,
  pagination = false,
}: {
  title?: string;
  data?: any;
  loading?: number;
  pagination?: boolean;
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
      <DataGrid
        {...DATA_TABLE_OPTIONS({
          loading: loading === 1,
          rows: data,
          columns,
          defaultSortKey: 'supply',
          noDataText: 'No Staking Positions Available',
          noResultsText: 'Current filters return no results',
        })}
        hideFooter={!pagination}
        slotProps={{
          cell: {
            style: {
              backgroundColor: isDark ? '#121212' : '#fff',
            },
          },
        }}
      />
    </Paper>
  );
}
