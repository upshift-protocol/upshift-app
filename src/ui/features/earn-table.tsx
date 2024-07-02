import useFetcher from '@/hooks/use-fetcher';
import type { UseQueryResult } from '@tanstack/react-query';
import type { IColumn } from '@/utils/types';
import { RTable } from '../components/table';

const columns: readonly IColumn[] = [
  { id: 'name', value: 'Name', minWidth: 150 },
  { id: 'totalSupply', value: 'Total Supply', align: 'right', minWidth: 150 },
  {
    id: 'apy',
    value: 'Net APY',
    minWidth: 100,
    align: 'right',
    format: (value: number) => value.toLocaleString('en-US'),
  },
  {
    id: 'collateral',
    value: 'Collateral',
    minWidth: 100,
    align: 'right',
    format: (value: number) => value.toLocaleString('en-US'),
  },
  {
    id: 'getLoansOperator',
    value: 'Curator',
    minWidth: 100,
  },
];

export function EarnTable() {
  const { data } = useFetcher({
    queryKey: ['lending-pools'],
    initialData: [],
  }) as UseQueryResult<any>;

  console.log('rows:', data);
  console.log('columns:', columns);

  return <RTable columns={columns} data={data} uidKey="address" />;
}
