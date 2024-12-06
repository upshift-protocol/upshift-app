import Image from 'next/image';
import { FALLBACK_CHAINID, type IAddress } from '@augustdigital/sdk';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import TableCell from '@mui/material/TableCell';
import Stack from '@mui/material/Stack';
import Skeleton from '@mui/material/Skeleton';
import Tooltip from '@mui/material/Tooltip';
import { getChainNameById } from '@/utils/helpers/ui';
import type { GridColDef, GridColumnHeaderParams } from '@mui/x-data-grid';
import { DataGrid } from '@mui/x-data-grid';
import { TABLE_HEADER_FONT_WEIGHT } from '@/utils/constants';
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
    flex: 2,
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
    field: 'totalSupply',
    headerName: 'Total Supply',
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
              {stakingToken?.totalSupply?.normalized || '-'}
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
    </Box>
  );
}
