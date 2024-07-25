import { truncate } from '@augustdigital/sdk';
import type { IPoolWithUnderlying } from '@augustdigital/sdk';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import type { GridColDef } from '@mui/x-data-grid';
import { DataGrid } from '@mui/x-data-grid';
import { useMemo } from 'react';
import LinkAtom from '../atoms/anchor-link';

export default function VaultAllocation(
  props: (IPoolWithUnderlying | undefined) & { loading: boolean },
) {
  const columns: GridColDef<(typeof rows)[number]>[] = [
    {
      field: 'address',
      headerName: 'Loan Address',
      description: 'The vault address.',
      minWidth: 200,
      editable: false,
      renderCell({ value }) {
        if (!value) return '-';
        return <LinkAtom>{truncate(value)}</LinkAtom>;
      },
    },
    {
      field: 'allocation',
      headerName: 'Allocation',
      description: 'Proportion of the vault supply allocated to this market.',
      minWidth: 100,
      editable: true,
      renderCell({ value }) {
        if (!value) return '-';
        return `${value}%`;
      },
    },
    {
      field: 'supply',
      headerName: 'Vault Supply',
      description: 'The amount supplied to the market',
      type: 'number',
      minWidth: 200,
      editable: true,
      renderCell({ value }) {
        if (!value) return '-';
        return `${value} USDC`;
      },
    },
    {
      field: 'collateral',
      headerName: 'Collateral',
      type: 'number',
      minWidth: 200,
      editable: true,
      renderCell({ value }) {
        if (!value) return '-';
        return '-';
      },
    },
    {
      field: 'liquidationLTV',
      headerName: 'Liquidation LTV',
      minWidth: 200,
      type: 'number',
      description:
        'The loan-to-value ratio at which a position in this market is eligible for liquidation.',
      renderCell({ value }) {
        if (!value) return '-';
        return `${value}%`;
      },
    },
  ];

  // TODO: deploy a loan and get attributes based on it here
  const rows = useMemo(() => {
    if (!props?.loans?.length) return [];
    return props?.loans?.map((l, i) => ({
      id: i,
      address: l,
      allocation: '100',
      supply: '0.0',
      collateral: '0.0',
      liquidationLTV: '100',
    }));
  }, [props?.loans]);

  return (
    <Stack gap={3} direction="column">
      <Typography variant="h6">Vault Allocation Breakdown</Typography>

      <DataGrid
        loading={props.loading}
        rows={rows}
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
