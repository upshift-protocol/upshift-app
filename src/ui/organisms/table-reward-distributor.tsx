import Image from 'next/image';
import { FALLBACK_CHAINID, type IAddress } from '@augustdigital/sdk';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Skeleton from '@mui/material/Skeleton';
import Tooltip from '@mui/material/Tooltip';
import { getChainNameById } from '@/utils/helpers/ui';
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
    field: 'name',
    headerName: 'Position',
    renderHeader: (params: GridColumnHeaderParams) => (
      <span style={{ fontWeight: TABLE_HEADER_FONT_WEIGHT }}>
        {params.colDef.headerName}
      </span>
    ),
    flex: 2,
    minWidth: 300,
    editable: false,
    renderCell({ row }) {
      if (!row) return '-';
      const { stakingToken } = row;
      return (
        <Stack justifyContent={'center'} height="100%">
          {stakingToken?.name}
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
    flex: 1,
    maxWidth: 100,
    editable: false,
    renderCell({ row }) {
      if (!row) {
        return <Skeleton variant="circular" height={36} width={36} />;
      }

      return (
        <Stack justifyContent={'center'} height="100%">
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
    field: 'depositToken',
    headerName: 'Deposit Token',
    renderHeader: (params: GridColumnHeaderParams) => (
      <span style={{ fontWeight: TABLE_HEADER_FONT_WEIGHT }}>
        {params.colDef.headerName}
      </span>
    ),
    flex: 2,
    editable: false,
    renderCell({ row }) {
      const { stakingToken } = row;
      if (!row) {
        return (
          <Stack alignItems="center" gap={1} direction="row">
            <Skeleton variant="circular" height={24} width={24} />
            <Skeleton variant="text" height={36} width={48} />
          </Stack>
        );
      }
      return (
        <Stack
          justifyContent="center"
          height="100%"
          onClick={(e) => e.stopPropagation()}
          width="fit-content"
        >
          <AssetDisplay
            imgSize={20}
            symbol={stakingToken?.symbol}
            address={stakingToken?.address as IAddress}
            chainId={stakingToken?.chain as number}
          />
        </Stack>
      );
    },
  },
  {
    field: 'maxApy',
    headerName: 'Max APY',
    renderHeader: (params: GridColumnHeaderParams) => (
      <span style={{ fontWeight: TABLE_HEADER_FONT_WEIGHT }}>
        {params.colDef.headerName}
      </span>
    ),
    flex: 1,
    editable: false,
    headerAlign: 'right',
    renderCell({ row }) {
      const { maxApy } = row;
      if (!maxApy) {
        return <Skeleton variant="text" height={36} />;
      }

      return (
        <Stack alignItems="end" height="100%" justifyContent={'center'}>
          <AmountDisplay>
            {maxApy && Number(maxApy) >= 1
              ? `${([maxApy] as string[]).join('')?.toString()?.slice(0, 5)}%`
              : '-'}
          </AmountDisplay>
        </Stack>
      );
    },
  },
  {
    field: 'totalSupply',
    headerName: 'Total Supply',
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
        <Stack
          alignItems="end"
          width="100%"
          height="100%"
          justifyContent={'center'}
        >
          <AmountDisplay symbol={stakingToken?.symbol} round usd>
            {stakingToken?.totalSupply?.normalized || '-'}
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
    sortable: false,
    renderHeader: (params: GridColumnHeaderParams) => (
      <span style={{ fontWeight: TABLE_HEADER_FONT_WEIGHT }}>
        {params.colDef.headerName}
      </span>
    ),
    flex: 2,
    renderCell({ row }) {
      return RewardDistributorActionsMolecule({
        stakingToken: row,
        type: 'staking',
      });
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

      <DataGrid
        {...DATA_TABLE_OPTIONS({
          pagination: false,
          rows: data,
          columns,
          loading: loading === 1,
          defaultSortKey: 'supply',
          noDataText: 'No Staking Position Available',
          noResultsText: 'Current filters return no results',
        })}
        hideFooter={!pagination}
      />
    </Box>
  );
}
