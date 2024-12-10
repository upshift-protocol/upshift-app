import Image from 'next/image';
import type { IColumn } from '@/utils/types';
import type { IPoolWithUnderlying, IAddress } from '@augustdigital/sdk';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import TableCell from '@mui/material/TableCell';
import Stack from '@mui/material/Stack';
import Skeleton from '@mui/material/Skeleton';
import Tooltip from '@mui/material/Tooltip';
import { FALLBACK_CHAINID } from '@/utils/constants';
import { getChainNameById, renderPartnerImg } from '@/utils/helpers/ui';
import AmountDisplay from '../atoms/amount-display';
import TableMolecule from '../molecules/table';
import PoolActionsMolecule from './actions-pool';
import AssetDisplay from '../molecules/asset-display';
import Background from '../atoms/background';

const columns: readonly IColumn[] = [
  { id: 'name', value: 'Name', minWidth: 180 },
  {
    id: 'chainId',
    value: 'Chain',
    minWidth: 50,
    format: (value: number) => value.toString(),
    component: ({
      children: {
        props: { children },
      },
    }: any) => {
      if (!children)
        return (
          <TableCell>
            <Skeleton variant="circular" height={36} width={36} />
          </TableCell>
        );
      return (
        <TableCell>
          <Stack justifyContent={'center'}>
            <Background color="white" variant="circular">
              <Tooltip
                title={getChainNameById(children?.[0])}
                arrow
                placement="top"
              >
                <Image
                  src={`/img/chains/${children?.[0] && children?.[0] !== '-' ? children[0] : FALLBACK_CHAINID}.svg`}
                  alt={children?.[0]}
                  height={22}
                  width={22}
                />
              </Tooltip>
            </Background>
          </Stack>
        </TableCell>
      );
    },
  },
  {
    id: 'underlying',
    value: 'Deposit Token',
    flex: 2,
    component: ({
      children,
    }: {
      children?: { props?: { children: string } };
    }) => {
      const token = children?.props?.children?.split('_');
      if (!token?.length) return null;
      const [symbol, chain, address] = token;
      if (!symbol)
        return (
          <TableCell>
            <Stack alignItems="center" gap={1} direction="row">
              <Skeleton variant="circular" height={24} width={24} />
              <Skeleton variant="text" height={36} width={48} />
            </Stack>
          </TableCell>
        );
      return (
        <TableCell>
          <Stack alignItems="start">
            <div onClick={(e) => e.stopPropagation()}>
              <AssetDisplay
                imgSize={20}
                symbol={symbol}
                address={address as IAddress}
                chainId={chain ? Number(chain) : undefined}
              />
            </div>
          </Stack>
        </TableCell>
      );
    },
  },
  {
    id: 'totalSupply',
    value: 'TVL',
    align: 'right',
    minWidth: 150,
    format: (value: number) => value.toLocaleString('en-US'),
    component: ({
      children: {
        props: { children },
      },
    }: any) => {
      if (!children)
        return (
          <TableCell>
            <Skeleton variant="text" height={36} />
          </TableCell>
        );
      return (
        <TableCell>
          <Stack alignItems="end">
            <AmountDisplay symbol={children?.[2]} round usd>
              {children?.[0] || '-'}
            </AmountDisplay>
          </Stack>
        </TableCell>
      );
    },
  },
  {
    id: 'apy',
    value: 'Avg. APY',
    minWidth: 100,
    align: 'right',
    format: (value: number) => value.toFixed(2),
    component: ({
      children: {
        props: { children },
      },
    }: {
      children: { props: { children: string[] | string } };
    }) => {
      if (!children && children?.length === 0)
        return (
          <TableCell>
            <Skeleton variant="text" height={36} />
          </TableCell>
        );
      return (
        <TableCell>
          <Stack alignItems="end">
            <AmountDisplay>
              {children?.length && Number(children?.[0]) >= 1
                ? `${(children as string[]).join('')}`
                : '-'}
            </AmountDisplay>
          </Stack>
        </TableCell>
      );
    },
  },
  {
    id: 'rewards',
    value: 'Rewards',
    flex: 1,
    component: ({
      children,
    }: {
      children: {
        type: string;
        upshift_points: boolean;
        additional_points: string[];
      };
    }) => {
      if (!children.type)
        return (
          <TableCell>
            <Skeleton variant="text" height={36} />
          </TableCell>
        );
      if (children?.additional_points?.length === 0) {
        return <TableCell>-</TableCell>;
      }
      return (
        <TableCell>
          <Stack gap={0.75} direction="row">
            {children.additional_points
              ?.filter((p) => !p.includes('Hemi'))
              ?.map((point, i) => {
                const imgSize = 26;
                return (
                  <Tooltip
                    title={<Typography fontSize={'16px'}>{point}</Typography>}
                    arrow
                    placement="top"
                    key={`table-pools-rewards-${i}`}
                  >
                    <Box
                      style={{
                        backgroundColor: 'white',
                        borderRadius: '50%',
                        height: imgSize,
                        width: imgSize,
                        overflow: 'hidden',
                      }}
                    >
                      <Image
                        src={`/img/partners/${renderPartnerImg(point)}`}
                        alt={point}
                        height={imgSize}
                        width={imgSize}
                        style={{
                          padding: point?.includes('Lombard') ? '4px' : '0',
                        }}
                      />
                    </Box>
                  </Tooltip>
                );
              })}
          </Stack>
        </TableCell>
      );
    },
  },
  {
    id: 'hardcodedStrategist',
    value: 'Strategist',
    flex: 1,
  },
];

export default function PoolsTableOrganism({
  title,
  data,
  loading,
  pagination,
}: {
  title?: string;
  data: IPoolWithUnderlying[];
  loading?: number;
  pagination?: boolean;
}) {
  return (
    <Box>
      {title ? (
        <Typography variant="h6" mb={{ xs: 0, md: 1 }}>
          {title}
        </Typography>
      ) : null}
      <TableMolecule
        columns={columns}
        data={data}
        uidKey="address"
        loading={loading}
        action={(rowData) => PoolActionsMolecule({ pool: rowData })}
        pagination={pagination}
      />
    </Box>
  );
}
