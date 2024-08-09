import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { IColumn } from '@/utils/types';
import { isAddress, zeroAddress } from 'viem';
import { truncate } from '@/utils/helpers/string';
import { Skeleton, Stack, Typography } from '@mui/material';
import {
  explorerLink,
  type IAddress,
  type INormalizedNumber,
} from '@augustdigital/sdk';
import { FALLBACK_CHAINID } from '@/utils/constants/web3';
import { useAccount } from 'wagmi';
import LinkAtom from '../atoms/anchor-link';

export type ITableType = 'pools' | 'custom';

type ITableItem = Record<
  string,
  string | number | IAddress | INormalizedNumber
>;

type ITable = {
  columns: readonly IColumn[];
  data?: ITableItem[];
  uidKey: string;
  action?: (props: any) => JSX.Element;
  loading?: number;
  type?: ITableType;
  pagination?: boolean;
  hover?: boolean;
};

export default function TableMolecule({
  data,
  columns,
  uidKey,
  action,
  loading,
  pagination = true,
  hover = true,
  type = 'custom',
}: ITable) {
  const { address } = useAccount();
  const router = useRouter();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

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

  const extractData = (value: any) => {
    const extractor = () => {
      if (value?.normalized) return value?.normalized;
      return value;
    };
    const extracted = extractor();
    // if either string address or array of string addresses
    if (
      (typeof extracted === 'string' && isAddress(extracted)) ||
      (Array.isArray(extracted) && isAddress(extracted?.[0]))
    ) {
      // if address array
      if (Array.isArray(extracted))
        return (
          <Stack direction="row" justifyContent="end">
            {extracted.map((e, i) => {
              const isNative = e === zeroAddress;
              if (isNative) return 'ETH';
              return (
                <LinkAtom
                  key={`link-${i}-${e}`}
                  href={explorerLink(e, FALLBACK_CHAINID, 'address')}
                >
                  {e ? truncate(e) : '-'}
                </LinkAtom>
              );
            })}
          </Stack>
        );
      // else string address
      const isNative = extracted === zeroAddress;
      if (isNative) return 'ETH';

      return (
        <LinkAtom href={explorerLink(extracted, FALLBACK_CHAINID, 'address')}>
          {extracted ? truncate(extracted) : '-'}
        </LinkAtom>
      );
    }
    return extracted || '-';
  };

  const rows = useMemo(() => {
    if (loading) {
      const mockOb = columns.reduce(
        (acc, curr) => {
          acc[curr.id] = '-';
          return acc;
        },
        {} as Record<string, string>,
      );
      return Array(1).fill(mockOb);
    }
    if (!data) return [];

    const sliced = data?.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage,
    );
    return sliced;
  }, [data, page, rowsPerPage, address]);

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
              {action || type === 'pools' ? <TableCell /> : null}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, i) => {
              return (
                <TableRow
                  hover={hover}
                  role="checkbox"
                  tabIndex={-1}
                  key={`row-${row.name || row.id}-${i}`}
                  onClick={(e) => handleRowClick(e, i)}
                  style={{ cursor: 'pointer' }}
                >
                  {columns.map((column) => {
                    const { underlying } = row;
                    let value = row[column.id as keyof ITableItem];
                    value = extractData(value);
                    value =
                      (column.format && typeof value === 'number'
                        ? column.format(value)
                        : value) || '-';

                    function renderValue() {
                      // TODO: optimize
                      // if is a number
                      if (/^\d+(?:\.\d{1,18})?$/.test(String(value))) {
                        // if it is an apy
                        if (
                          column.id.includes('apy') ||
                          column.id.includes('apr')
                        ) {
                          return (
                            <Typography fontFamily={'monospace'}>
                              {value || '-'}%
                            </Typography>
                          );
                        }
                        // else it is an asset amount
                        return (
                          <Typography fontFamily={'monospace'}>
                            {value || '-'} {underlying?.symbol}
                          </Typography>
                        );
                      }
                      return <Typography>{value || '-'}</Typography>;
                    }
                    return (
                      <TableCell
                        component={column?.component}
                        key={column.id}
                        align={column.align}
                      >
                        {loading ? (
                          <Skeleton variant="text" height={36} />
                        ) : (
                          renderValue()
                        )}
                      </TableCell>
                    );
                  })}
                  {action ? (
                    <TableCell align={'right'}>{action(row)}</TableCell>
                  ) : null}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      {pagination ? (
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={data?.length ?? 0}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      ) : null}

      {!rows.length && (
        <Stack p={4} justifyContent={'center'} alignItems={'center'}>
          <Typography fontSize={'14px'} color="GrayText">
            No positions available
          </Typography>
        </Stack>
      )}
    </Box>
  );
}
