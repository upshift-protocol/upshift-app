import Typography from '@mui/material/Typography';
import TableCell from '@mui/material/TableCell';
import Stack from '@mui/material/Stack';
import Skeleton from '@mui/material/Skeleton';
import Tooltip from '@mui/material/Tooltip';
import { getChainNameById } from '@/utils/helpers/ui';
import type { IAddress } from '@augustdigital/sdk';
import Image from 'next/image';
import { FALLBACK_CHAINID } from '@/utils/constants/web3';
import { Paper, useTheme } from '@mui/material';
import { useThemeMode } from '@/stores/theme';
import type { GridColDef, GridColumnHeaderParams } from '@mui/x-data-grid';
import { DataGrid } from '@mui/x-data-grid';
import { TABLE_HEADER_FONT_WEIGHT } from '@/utils/constants';
import AmountDisplay from '../atoms/amount-display';
import AssetDisplay from '../atoms/asset-display';
import Background from '../atoms/background';
import RewardDistributorActionsMolecule from './actions-reward-distributor';

const columns: readonly GridColDef<any[number]>[] = [
  {
    field: 'stakedToken',
    headerName: 'Staked Token',
    renderHeader: (params: GridColumnHeaderParams) => (
      <span style={{ fontWeight: TABLE_HEADER_FONT_WEIGHT }}>
        {params.colDef.headerName}
      </span>
    ),
    flex: 2,
    editable: false,
    renderCell({ row }) {
      const { stakingToken, chainId } = row;
      if (!row) {
        return (
          <TableCell>
            <Stack alignItems="center" gap={1} direction="row">
              <Skeleton variant="circular" height={24} width={24} />
              <Skeleton variant="text" height={36} width={48} />
            </Stack>
          </TableCell>
        );
      }

      return (
        <TableCell>
          <Stack alignItems="start">
            <div onClick={(e) => e.stopPropagation()}>
              <AssetDisplay
                img={`/img/tokens/${stakingToken.symbol}.svg`}
                imgSize={20}
                symbol={stakingToken.symbol}
                address={stakingToken?.address as IAddress}
                chainId={chainId ? Number(chainId) : undefined}
              />
            </div>
          </Stack>
        </TableCell>
      );
    },
  },
  {
    field: 'totalStaked',
    headerName: 'Total Staked',
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
        return (
          <TableCell>
            <Skeleton variant="text" height={36} />
          </TableCell>
        );
      }

      return (
        <TableCell
          style={{
            paddingTop: '2px',
          }}
        >
          <Stack alignItems="end">
            <AmountDisplay symbol={stakingToken?.symbol} round usd>
              {stakingToken?.totalStaked?.normalized || '-'}
            </AmountDisplay>
          </Stack>
        </TableCell>
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
    flex: 1,
    editable: false,
    renderCell({ row }) {
      if (!row) {
        return (
          <TableCell>
            <Skeleton variant="circular" height={36} width={36} />
          </TableCell>
        );
      }

      return (
        <TableCell>
          <Stack justifyContent={'center'}>
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
        </TableCell>
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
          <TableCell>
            <Stack alignItems="center" gap={1} direction="row">
              <Skeleton variant="circular" height={24} width={24} />
              <Skeleton variant="text" height={36} width={48} />
            </Stack>
          </TableCell>
        );
      }

      return (
        <TableCell>
          <Stack alignItems="start">
            <div onClick={(e) => e.stopPropagation()}>
              <AssetDisplay
                img={`/img/tokens/${rewardToken.symbol}.svg`}
                imgSize={20}
                symbol={rewardToken.symbol}
                address={rewardToken?.address as IAddress}
                chainId={chainId ? Number(chainId) : undefined}
              />
            </div>
          </Stack>
        </TableCell>
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
    flex: 2,
    editable: false,
    renderCell({ row }) {
      const { apy } = row;
      if (!apy) {
        return (
          <TableCell>
            <Skeleton variant="text" height={36} />
          </TableCell>
        );
      }

      return (
        <TableCell>
          <Stack alignItems="end">
            <AmountDisplay>
              {apy && Number(apy) >= 1
                ? `${([apy] as string[]).join('')?.toString()?.slice(0, 5)}%`
                : '-'}
            </AmountDisplay>
          </Stack>
        </TableCell>
      );
    },
  },
  {
    field: 'claimable',
    headerName: 'Claimable',
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
        return (
          <TableCell>
            <Skeleton variant="text" height={36} />
          </TableCell>
        );
      }

      console.log(row, 'stakingToke');

      return (
        <TableCell
          style={{
            paddingTop: '2px',
          }}
        >
          <Stack alignItems="end">
            <AmountDisplay symbol={rewardToken?.symbol} round usd>
              {rewardToken?.redeemable?.normalized || '-'}
            </AmountDisplay>
          </Stack>
        </TableCell>
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
      <DataGrid
        loading={loading === 1}
        rows={data}
        rowHeight={60}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
          sorting: {
            sortModel: [{ field: 'supply', sort: 'desc' }],
          },
        }}
        pageSizeOptions={[5]}
        disableRowSelectionOnClick
        slots={{
          noRowsOverlay: () => (
            <Stack height="100%" alignItems="center" justifyContent="center">
              No Staking Position Available
            </Stack>
          ),
          noResultsOverlay: () => (
            <Stack height="100%" alignItems="center" justifyContent="center">
              Current filters return no results
            </Stack>
          ),
        }}
      />
    </Paper>
  );
}
