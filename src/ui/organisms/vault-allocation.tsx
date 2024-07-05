import type { IPool } from '@augustdigital/types';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import type { GridColDef } from '@mui/x-data-grid';
import { DataGrid } from '@mui/x-data-grid';

const columns: GridColDef<(typeof rows)[number]>[] = [
  {
    field: 'allocation',
    headerName: 'Allocation',
    description: 'Proportion of the vault supply allocated to this market.',
    minWidth: 150,
    editable: true,
  },
  {
    field: 'supply',
    headerName: 'Vault Supply',
    description: 'The amount supplied to the market',
    type: 'number',
    minWidth: 300,
    editable: true,
  },
  {
    field: 'collateral',
    headerName: 'Collateral',
    type: 'number',
    minWidth: 300,
    editable: true,
  },
  {
    field: 'liquidationLTV',
    headerName: 'Liquidation LTV',
    minWidth: 300,
    type: 'number',
    description:
      'The loan-to-value ratio at which a position in this market is eligible for liquidation.',
    valueGetter: (_value: any, row: any) =>
      `${row.firstName || ''} ${row.lastName || ''}`,
  },
];

const rows = [
  {
    id: 1,
    allocation: '100%',
    supply: '0 USDC',
    collateral: '0 USDC',
    liquidationLTV: '80%',
  },
];

export default function VaultAllocation(
  props: (IPool | undefined) & { loading: boolean },
) {
  return (
    <Stack gap={3} direction="column">
      <Typography variant="h6">Vault Allocation Breakdown</Typography>

      <DataGrid
        loading={props.loading}
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        pageSizeOptions={[5]}
        disableRowSelectionOnClick
      />
    </Stack>
  );
}
