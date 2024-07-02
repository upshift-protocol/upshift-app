import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import * as React from 'react';
import { useRouter } from 'next/navigation';
import type { IColumn } from '@/utils/types';
import { isAddress } from 'viem';
import Link from 'next/link';
import { truncate } from '@/utils/helpers';
import Modal from './modal';

type ITableItem = Record<string, string | number>;

type ITable = {
  columns: readonly IColumn[];
  data: ITableItem[];
  uidKey: string;
};

export function RTable({ data, columns, uidKey }: ITable) {
  const router = useRouter();
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

  const handleRowClick = (e: React.SyntheticEvent, index: number) => {
    e.preventDefault();
    const uid = data?.[index]?.[uidKey];
    if (!uid) {
      console.error('uid not found');
      return;
    }
    router.push(`/pools/${uid}`);
  };

  const renderCell = (value: any) => {
    if (value?.normalized) return value?.normalized;
    if (isAddress(value)) return <Link href="#">{truncate(value)}</Link>;
    return value;
  };

  console.log('rows:', data);
  console.log('columns:', columns);

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
                  {column.value}
                </TableCell>
              ))}
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, i) => {
                return (
                  <TableRow
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    key={row.name}
                    onClick={(e) => handleRowClick(e, i)}
                    style={{ cursor: 'pointer' }}
                  >
                    {columns.map((column) => {
                      const value = row[column.id as keyof ITableItem];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.format && typeof value === 'number'
                            ? column.format(renderCell(value))
                            : renderCell(value)}
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
                        <Modal
                          title="Deposit"
                          buttonProps={{
                            children: 'Deposit',
                            variant: 'outlined',
                          }}
                        >
                          <Stack gap={2}>
                            <TextField
                              id="outlined-basic"
                              label="Amount In"
                              variant="outlined"
                            />
                            <TextField
                              id="outlined-basic"
                              label="Amount Out"
                              disabled
                              variant="outlined"
                            />
                            <Button size="large" variant="contained">
                              Submit Transaction
                            </Button>
                          </Stack>
                        </Modal>
                        <Modal
                          title="Withdraw"
                          buttonProps={{
                            children: 'Withdraw',
                            variant: 'outlined',
                          }}
                        >
                          <Stack spacing={2} position="relative">
                            <TextField
                              id="outlined-basic"
                              label="Amount In"
                              variant="outlined"
                            />
                            <TextField
                              id="outlined-basic"
                              label="Amount Out"
                              variant="outlined"
                              disabled
                            />
                            <Button
                              style={{ marginTop: '1rem' }}
                              size="large"
                              variant="contained"
                            >
                              Submit Transaction
                            </Button>
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
        count={data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  );
}
