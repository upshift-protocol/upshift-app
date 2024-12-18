import { explorerLink, truncate } from '@augustdigital/sdk';
import type {
  IAddress,
  IPoolLoan,
  IPoolWithUnderlying,
} from '@augustdigital/sdk';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import type { GridColDef, GridColumnHeaderParams } from '@mui/x-data-grid';
import { DataGrid } from '@mui/x-data-grid';
import useFetcher from '@/hooks/use-fetcher';
import type { UseQueryResult } from '@tanstack/react-query';
import Image from 'next/image';
import { Tooltip } from '@mui/material';
import { getTokenSymbol } from '@/utils/helpers/ui';
import { Fragment, useMemo } from 'react';
import { isAddress } from 'viem';
import {
  TABLE_HEADER_FONT_WEIGHT,
  FALLBACK_CHAINID,
  DATA_TABLE_OPTIONS,
} from '@/utils/constants';
import LinkAtom from '../atoms/anchor-link';
import AmountDisplay from '../atoms/amount-display';
import AssetDisplay from '../molecules/asset-display';

/**
 * Utils
 */
const renderTokenExposure = (
  token: { value: IAddress; label: string },
  row: any,
  value: any,
  index: number,
) => {
  function renderTokenLogo() {
    console.log('exp', token);
    if (getTokenSymbol(token?.value)?.length > 30) {
      if (!token?.label?.includes('_')) {
        return token?.label;
      }
      return truncate(token.value, 3);
    }
    return getTokenSymbol(token.value);
  }
  if (!token?.label?.includes('_')) {
    return <AssetDisplay background tooltip symbol={token.label} />;
  }
  if (
    !isAddress(token.label) &&
    isAddress(token.value) &&
    getTokenSymbol(token?.value)?.length < 30
  ) {
    return (
      <Fragment>
        <LinkAtom
          href={explorerLink(
            token.value,
            row?.chainId || FALLBACK_CHAINID,
            'address',
          )}
        >
          {renderTokenLogo()}
        </LinkAtom>
        {index !== Number(value?.length) - 1 ? ',' : null}
      </Fragment>
    );
  }
  return null;
};

/**
 * Table Columns
 */
const columns: GridColDef<any[number]>[] = [
  {
    field: 'address',
    headerName: 'Capital Deployment',
    description: 'The vault address.',
    renderHeader: (params: GridColumnHeaderParams) => (
      <span style={{ fontWeight: TABLE_HEADER_FONT_WEIGHT }}>
        {params.colDef.headerName}
      </span>
    ),
    flex: 2,
    editable: false,
    renderCell({ value, row }) {
      if (!value) return '-';
      return (
        <Stack justifyContent={'center'} height="100%">
          <LinkAtom
            href={explorerLink(
              value,
              row?.chainId || FALLBACK_CHAINID,
              'address',
            )}
          >
            {truncate(value)}
          </LinkAtom>
        </Stack>
      );
    },
  },
  {
    field: 'positions',
    headerName: 'Protocol Exposure',
    renderHeader: (params: GridColumnHeaderParams) => (
      <span style={{ fontWeight: TABLE_HEADER_FONT_WEIGHT }}>
        {params.colDef.headerName}
      </span>
    ),
    flex: 2,
    editable: false,
    renderCell({ value, row }) {
      if (!value?.length) return '-';
      return (
        <Stack direction="row" alignItems={'center'} height="100%" gap={1}>
          {value?.map((item: { value: string; label: string }) => (
            <Tooltip
              key={`table-loans-${row.id}-${item.value}`}
              title={item.label}
              arrow
              placement="top"
            >
              <Image
                src={item.value}
                alt={item.value}
                height={24}
                width={24}
                style={{ borderRadius: '6px' }}
              />
            </Tooltip>
          ))}
        </Stack>
      );
    },
  },
  {
    field: 'exposure',
    headerName: 'Token Exposure',
    renderHeader: (params: GridColumnHeaderParams) => (
      <span style={{ fontWeight: TABLE_HEADER_FONT_WEIGHT }}>
        {params.colDef.headerName}
      </span>
    ),
    flex: 2,
    editable: false,
    renderCell({ value, row }) {
      if (!value?.length) return '-';
      return (
        <Stack direction="row" alignItems={'center'} height="100%" gap={1}>
          {value.map((exp: { value: IAddress; label: string }, i: number) =>
            exp.label !== 'eth' && String(exp.value) !== 'eth' ? (
              <span
                key={`table-loans-${row.id}-${exp.value}-${i}`}
                style={{
                  alignItems: 'center',
                  display:
                    renderTokenExposure(exp, row, value, i) === null
                      ? 'none'
                      : 'flex',
                }}
              >
                {renderTokenExposure(exp, row, value, i)}
              </span>
            ) : null,
          )}
        </Stack>
      );
    },
  },
  {
    field: 'allocation',
    headerName: 'Allocation',
    description: 'Proportion of the vault supply allocated to this market.',
    renderHeader: (params: GridColumnHeaderParams) => (
      <span style={{ fontWeight: TABLE_HEADER_FONT_WEIGHT }}>
        {params.colDef.headerName}
      </span>
    ),
    flex: 1,
    sortable: true,
    type: 'number',
    editable: false,
    renderCell({ value }) {
      if (!value) return '- %';
      if (typeof value === 'number') return `${(value * 100).toFixed(3)}%`;
      return `${value || '-'}%`;
    },
  },
  {
    field: 'supply',
    headerName: 'Vault Supply',
    description: 'The amount supplied to the market',
    renderHeader: (params: GridColumnHeaderParams) => (
      <span style={{ fontWeight: TABLE_HEADER_FONT_WEIGHT }}>
        {params.colDef.headerName}
      </span>
    ),
    type: 'number',
    flex: 2,
    editable: false,
    renderCell({ value, row }) {
      if (!value) return '-';
      return (
        <Stack alignItems="end" justifyContent="center" height="100%">
          <AmountDisplay usd symbol={row?.underlying} round size="14px">
            {value}
          </AmountDisplay>
        </Stack>
      );
    },
  },
  // {
  //   field: 'currentApr',
  //   headerName: 'APR',
  //   renderHeader: (params: GridColumnHeaderParams) => (
  //     <span style={{ fontWeight: TABLE_HEADER_FONT_WEIGHT }}>
  //       {params.colDef.headerName}
  //     </span>
  //   ),
  //   flex: 1,
  //   type: 'number',
  //   editable: false,
  //   description: 'The borrowing interest rate paid back to the pool.',
  //   renderCell({ value }) {
  //     if (!value) return '-';
  //     return `${value}%`;
  //   },
  // },
];

/**
 * Main Component
 */
export default function VaultAllocation(
  props: (IPoolWithUnderlying | undefined) & { loading?: boolean },
) {
  const { data: loans, isLoading } = useFetcher({
    queryKey: ['pool-loans', props.address],
    enabled: !props?.loans?.length,
  }) as UseQueryResult<IPoolLoan[]>;

  const loansSelector = props?.loans || loans;

  const formattedRows = useMemo(() => {
    const loansWithData = loansSelector?.map((l, i) => ({
      id: i,
      address: l?.address,
      allocation: l?.allocation,
      supply: l?.principal?.normalized,
      collateral: l?.collateral,
      liquidationLTV: '',
      currentApr: l?.apr,
      underlying: props?.underlying?.symbol,
      positions: l?.positions,
      exposure: l?.exposure,
      chainId: props?.chainId,
    }));
    return loansWithData || [];
  }, [JSON.stringify(loansSelector)]);

  return (
    <Stack gap={3} direction="column" minHeight="20rem">
      <Typography variant="h6">Vault Allocation Breakdown</Typography>

      <DataGrid
        {...DATA_TABLE_OPTIONS({
          loading: props.loading || isLoading,
          rows: formattedRows,
          columns,
          defaultSortKey: 'supply',
          noDataText: 'No active loans available',
        })}
      />
    </Stack>
  );
}
