import { Box, Button, FormControl, Input, InputLabel, OutlinedInput, Stack, TextField, Typography } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import * as React from 'react';
import Modal from '../components/modal';

interface Column {
  id: string;
  label: string;
  minWidth?: number;
  align?: 'right';
  format?: (value: number) => string;
}

const columns: readonly Column[] = [
  { id: 'name', label: 'Name', minWidth: 170 },
  { id: 'supply', label: 'Total Supply', minWidth: 100 },
  {
    id: 'apy',
    label: 'Net APY',
    minWidth: 170,
    align: 'right',
    format: (value: number) => value.toLocaleString('en-US'),
  },
  {
    id: 'collateral',
    label: 'Collateral',
    minWidth: 170,
    align: 'right',
    format: (value: number) => value.toLocaleString('en-US'),
  },
  {
    id: 'curator',
    label: 'Curator',
    minWidth: 170,
    align: 'right',
    format: (value: number) => value.toFixed(2),
  },
];

interface Data {
  name: string;
  supply: number;
  collateral: number;
  curator: number;
  apy: number;
}

function createData(
  name: string,
  apy: number,
  curator: number,
  collateral: number,
  supply: number,
): Data {
  return { name, supply, collateral, curator, apy };
}

const rows = [createData('August Digital', 123, 1324171354, 3287263, 123123)];

export function EarnTable() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Box>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.name}>
                    {columns.map((column) => {
                      const value = row[column.id as keyof Data];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.format && typeof value === 'number'
                            ? column.format(value)
                            : value}
                        </TableCell>
                      );
                    })}
                    <TableCell align={'right'}>
                      <Stack
                        direction="row"
                        spacing={2}
                        alignItems="center"
                        justifyContent="end"
                      >
                        <Modal title='Deposit' buttonProps={{ children: "Deposit", variant: "outlined" }}>
                          <Stack gap={2}>
                          <TextField id="outlined-basic" label="Amount In" variant="outlined" />
                          <TextField id="outlined-basic" label="Amount Out" disabled variant="outlined" />
                          <Button size="large" variant="contained">Submit Transaction</Button>
                            </Stack>
                        </Modal>
                        <Modal title="Withdraw" buttonProps={{ children: "Withdraw", variant: "outlined" }}>
                        <Stack spacing={2} position="relative">
                          <TextField id="outlined-basic" label="Amount In" variant="outlined" />
                          <TextField id="outlined-basic" label="Amount Out" variant="outlined" disabled />
                          <Button style={{ marginTop: "1rem" }} size="large" variant="contained">Submit Transaction</Button>
                            </Stack>
                        </Modal>
                      </Stack>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  );
}
