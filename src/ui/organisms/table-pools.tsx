import Image from 'next/image';
import {
  type IPoolWithUnderlying,
  type IAddress,
  explorerLink,
  truncate,
} from '@augustdigital/sdk';
import Stack from '@mui/material/Stack';
import Skeleton from '@mui/material/Skeleton';
import Tooltip from '@mui/material/Tooltip';
import { FALLBACK_CHAINID } from '@/utils/constants/web3';
import type { GridColDef, GridColumnHeaderParams } from '@mui/x-data-grid';
import { TABLE_HEADER_FONT_WEIGHT } from '@/utils/constants/ui';
import { getChainNameById } from '@/utils/helpers/ui';
import { useMemo } from 'react';
import AmountDisplay from '../atoms/amount-display';
import AssetDisplay from '../atoms/asset-display';
import Background from '../atoms/background';
import DataTable from '../molecules/data-table';
import LinkAtom from '../atoms/anchor-link';
import PoolActionsMolecule from './actions-pool';

const newColumns: GridColDef<any[number]>[] = [
  {
    field: 'name',
    headerName: 'Name',
    description: 'Name of the vault.',
    renderHeader: (params: GridColumnHeaderParams) => (
      <span style={{ fontWeight: TABLE_HEADER_FONT_WEIGHT }}>
        {params.colDef.headerName}
      </span>
    ),
    flex: 3,
    editable: false,
  },
  {
    field: 'chainId',
    headerName: 'Chain',
    description: 'Network the vault is deployed on.',
    renderHeader: (params: GridColumnHeaderParams) => (
      <span style={{ fontWeight: TABLE_HEADER_FONT_WEIGHT }}>
        {params.colDef.headerName}
      </span>
    ),
    flex: 1,
    editable: false,
    renderCell({ value }) {
      if (!value) return <Skeleton variant="circular" height={36} width={36} />;
      return (
        <Stack justifyContent={'center'} height="100%">
          <Stack justifyContent={'center'}>
            <Background color="white" variant="circular">
              <Tooltip title={getChainNameById(value)} arrow placement="top">
                <Image
                  src={`/img/chains/${value || FALLBACK_CHAINID}.svg`}
                  alt={getChainNameById(value || FALLBACK_CHAINID)}
                  height={22}
                  width={22}
                />
              </Tooltip>
            </Background>
          </Stack>
        </Stack>
      );
    },
  },
  {
    field: 'underlying',
    headerName: 'Deposit Token',
    description: 'Name of the vault.',
    renderHeader: (params: GridColumnHeaderParams) => (
      <span style={{ fontWeight: TABLE_HEADER_FONT_WEIGHT }}>
        {params.colDef.headerName}
      </span>
    ),
    flex: 2,
    editable: false,
    renderCell({ value }) {
      if (!value)
        return (
          <Stack alignItems="center" gap={1} direction="row">
            <Skeleton variant="circular" height={24} width={24} />
            <Skeleton variant="text" height={36} width={48} />
          </Stack>
        );
      return (
        <Stack alignItems="start" justifyContent="center" height="100%">
          <div onClick={(e) => e.stopPropagation()}>
            <AssetDisplay
              img={`/img/tokens/${value?.symbol}.svg`}
              imgSize={20}
              symbol={value?.symbol}
              address={value?.address as IAddress}
              chainId={value?.chain ? Number(value?.chain) : undefined}
            />
          </div>
        </Stack>
      );
    },
  },
  {
    field: 'totalSupply',
    headerName: 'TVL',
    description: 'Name of the vault.',
    renderHeader: (params: GridColumnHeaderParams) => (
      <span style={{ fontWeight: TABLE_HEADER_FONT_WEIGHT }}>
        {params.colDef.headerName}
      </span>
    ),
    flex: 2,
    editable: false,
    renderCell({ value, row }) {
      if (!value) return <Skeleton variant="text" height={36} width={90} />;
      return (
        <Stack alignItems="end" height="100%" justifyContent="center">
          <AmountDisplay symbol={row?.underlying?.symbol} round usd>
            {value.normalized || '-'}
          </AmountDisplay>
        </Stack>
      );
    },
  },
  {
    field: 'apy',
    headerName: 'Avg. APY',
    description: 'Name of the vault.',
    renderHeader: (params: GridColumnHeaderParams) => (
      <span style={{ fontWeight: TABLE_HEADER_FONT_WEIGHT }}>
        {params.colDef.headerName}
      </span>
    ),
    flex: 2,
    editable: false,
    renderCell({ value, row }) {
      function renderInner() {
        if (!row?.withLoans)
          return <Skeleton variant="text" height={36} width={90} />;
        if (!value) return <span>-</span>;
        return (
          <AmountDisplay round symbol="%">
            {value}
          </AmountDisplay>
        );
      }
      return (
        <Stack alignItems="end" height="100%" justifyContent="center">
          {renderInner()}
        </Stack>
      );
    },
  },
  {
    field: 'hardcodedStrategist',
    headerName: 'Strategist',
    description: 'Name of the vault.',
    renderHeader: (params: GridColumnHeaderParams) => (
      <span style={{ fontWeight: TABLE_HEADER_FONT_WEIGHT }}>
        {params.colDef.headerName}
      </span>
    ),
    flex: 2,
    editable: false,
    renderCell({ value, row }) {
      function renderInner() {
        if (!value) return <Skeleton variant="text" height={36} width={120} />;
        return (
          <LinkAtom href={`${explorerLink(value, row?.chainId, 'address')}`}>
            {truncate(value)}
          </LinkAtom>
        );
      }
      return (
        <Stack alignItems="end" height="100%" justifyContent="center">
          {renderInner()}
        </Stack>
      );
    },
  },
  {
    field: 'address',
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
    flex: 4,
    renderCell({ value: _value, row }) {
      return PoolActionsMolecule({ pool: row });
    },
  },
];

export default function PoolsTableOrganism({
  title,
  data,
  loading,
}: {
  title?: string;
  data: IPoolWithUnderlying[];
  loading?: number;
}) {
  const memoizedData = useMemo(() => {
    return data;
  }, [JSON.stringify(data), loading]);
  return (
    <DataTable
      title={title || 'Pools'}
      data={memoizedData}
      defaultSortKey="totalSupply"
      columns={newColumns}
      loading={Boolean(loading)}
      type="pools"
    />
  );
}
