import { explorerLink, truncate } from '@augustdigital/sdk';
import type { IPoolLoan, IPoolWithUnderlying } from '@augustdigital/sdk';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import type { GridColDef } from '@mui/x-data-grid';
import { DataGrid } from '@mui/x-data-grid';
import { FALLBACK_CHAINID } from '@/utils/constants/web3';
import { zeroAddress } from 'viem';
import useFetcher from '@/hooks/use-fetcher';
import type { UseQueryResult } from '@tanstack/react-query';
import LinkAtom from '../atoms/anchor-link';
import AmountDisplay from '../atoms/amount-display';

const columns: GridColDef<any[number]>[] = [
  {
    field: 'address',
    headerName: 'Loan Address',
    description: 'The vault address.',
    flex: 2,
    editable: false,
    renderCell({ value }) {
      if (!value) return '-';
      return (
        <Stack justifyContent={'center'} height="100%">
          <LinkAtom href={explorerLink(value, FALLBACK_CHAINID, 'address')}>
            {truncate(value)}
          </LinkAtom>
        </Stack>
      );
    },
  },
  {
    field: 'collateral',
    headerName: 'Collateral',
    flex: 2,
    editable: true,
    renderCell({ value }) {
      if (!value) return '-';
      if (value === zeroAddress) return 'ETH';
      return (
        <LinkAtom href={explorerLink(value, FALLBACK_CHAINID, 'address')}>
          {truncate(value)}
        </LinkAtom>
      );
    },
  },
  {
    field: 'allocation',
    headerName: 'Allocation',
    description: 'Proportion of the vault supply allocated to this market.',
    flex: 1,
    type: 'number',
    editable: true,
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
    type: 'number',
    flex: 2,
    editable: true,
    renderCell({ value, row }) {
      if (!value) return '-';
      return (
        <Stack alignItems="end" justifyContent="center" height="100%">
          <AmountDisplay symbol={row?.underlying || 'N/A'} round size="14px">
            {value}
          </AmountDisplay>
        </Stack>
      );
    },
  },
  {
    field: 'currentApr',
    headerName: 'APR',
    flex: 1,
    type: 'number',
    description: 'The borrowing interest rate paid back to the pool.',
    renderCell({ value }) {
      if (!value) return '-';
      return `${value}%`;
    },
  },
  {
    field: 'liquidationLTV',
    headerName: 'Liquidation LTV',
    flex: 1,
    type: 'number',
    description:
      'The loan-to-value ratio at which a position in this market is eligible for liquidation.',
    renderCell({ value }) {
      if (!value) return '-';
      return `${value}%`;
    },
  },
];

export default function VaultAllocation(
  props: (IPoolWithUnderlying | undefined) & { loading?: boolean },
) {
  const { data: loans, isLoading } = useFetcher({
    queryKey: ['pool-loans', props.address],
    enabled: !props?.loans?.length,
  }) as UseQueryResult<IPoolLoan[]>;

  const loansSelector = props?.loans || loans;

  const rowsFormatter = () => {
    const loansWithData = loansSelector?.map((l, i) => ({
      id: i,
      address: l?.address,
      allocation: l?.allocation,
      supply: l?.principal?.normalized,
      collateral: l?.collateral,
      liquidationLTV: '',
      currentApr: l?.apr,
      underlying: props?.underlying?.symbol,
    }));
    return loansWithData;
  };

  // console.log('loans:', loans);
  // console.log('rowsFormatter:', rowsFormatter());

  return (
    <Stack gap={3} direction="column">
      <Typography variant="h6">Vault Allocation Breakdown</Typography>

      <DataGrid
        loading={props.loading || isLoading}
        rows={rowsFormatter()}
        columns={columns}
        autoHeight
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        pageSizeOptions={[5]}
        disableRowSelectionOnClick
        slots={{
          noRowsOverlay: () => (
            <Stack height="100%" alignItems="center" justifyContent="center">
              No loans available
            </Stack>
          ),
          noResultsOverlay: () => (
            <Stack height="100%" alignItems="center" justifyContent="center">
              Local filters returns no results
            </Stack>
          ),
        }}
      />
    </Stack>
  );
}
