import Stack from '@mui/material/Stack';
import Link from 'next/link';
import Typography from '@mui/material/Typography';
import type { GridColDef } from '@mui/x-data-grid';
import { DataGrid, GridCell, GridRow } from '@mui/x-data-grid';

const rowHeight = 70;
const pageSize = 5;

export default function DataTable({
  loading,
  title,
  noDataText,
  defaultSortKey,
  columns,
  data,
  type,
}: {
  loading?: boolean;
  title: string;
  noDataText?: string;
  defaultSortKey: string;
  columns: GridColDef<any[number]>[];
  data?: any[];
  type?: 'pools' | 'loans';
}) {
  return (
    <Stack gap={3} direction="column" minHeight={rowHeight * 2}>
      <Typography variant="h6">{title}</Typography>

      <DataGrid
        loading={loading}
        rows={data}
        getRowId={(row) => {
          return row.address;
        }}
        rowHeight={rowHeight}
        columns={columns}
        sx={{
          border: 'none',
        }}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize,
            },
          },
          sorting: {
            sortModel: [{ field: defaultSortKey, sort: 'desc' }],
          },
        }}
        pageSizeOptions={[pageSize]}
        disableRowSelectionOnClick
        slots={{
          cell(cellProps) {
            return <GridCell {...cellProps} />;
          },
          row(rowProps) {
            if (type === 'pools') {
              return (
                <Link
                  style={{ textDecoration: 'none', color: 'inherit' }}
                  href={`/pools/${rowProps.row.chainId}/${rowProps.row.address}`}
                >
                  <GridRow {...rowProps} />
                </Link>
              );
            }
            return <GridRow {...rowProps} />;
          },
          noRowsOverlay: () => (
            <Stack height="100%" alignItems="center" justifyContent="center">
              {noDataText || 'No data available'}
            </Stack>
          ),
          noResultsOverlay: () => (
            <Stack height="100%" alignItems="center" justifyContent="center">
              Current filters return no results
            </Stack>
          ),
        }}
      />
    </Stack>
  );
}
