import { styled } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import { toNormalizedBn, type IPoolWithUnderlying } from '@augustdigital/sdk';
import { Fragment, useMemo } from 'react';
import { useChainId } from 'wagmi';
import useFetcher from '@/hooks/use-fetcher';
import { formatCompactNumber } from '@/utils/helpers/ui';
import CustomStat from '../atoms/stat';

const ResponsiveStack = styled(Stack)(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    gap: '12px',
  },
  [theme.breakpoints.up('sm')]: {
    flexDirection: 'row',
    gap: '16px',
  },
}));

const OverviewStatsMolecule = ({
  pools,
  loading,
}: {
  pools?: IPoolWithUnderlying[];
  loading?: number;
}) => {
  const chainId = useChainId();

  const {
    data: ethPrice,
    isError,
    isFetching,
    isLoading,
  } = useFetcher({
    queryKey: ['price', 'eth'],
    initialData: 1,
  });

  const displayEth = isError || isFetching || isLoading;

  const totalSupplied = useMemo(() => {
    if (!pools?.length) return '0.0';
    let total = BigInt(0);
    pools.forEach(({ totalSupply }) => {
      total += totalSupply.raw ? BigInt(totalSupply.raw) : BigInt(0);
    });
    // TODO: return USD amount
    return toNormalizedBn(total).normalized;
  }, [pools?.length, chainId]);

  const totalBorrowed = useMemo(() => {
    if (!pools?.length) return '0.0';
    let total = BigInt(0);
    pools.forEach((p) => {
      total += p.totalBorrowed?.raw ? BigInt(p.totalBorrowed?.raw) : BigInt(0);
    });
    // TODO: return USD amount
    return toNormalizedBn(total).normalized;
  }, [pools?.length, chainId]);
  return (
    <ResponsiveStack>
      <CustomStat
        value={
          <Tooltip
            title={totalSupplied}
            disableHoverListener={totalSupplied === '0'}
            placement="top"
            arrow
          >
            <Fragment>{`${formatCompactNumber(Number(totalSupplied) * Number(ethPrice), { symbol: !displayEth })} ${displayEth ? 'ETH' : ''}`}</Fragment>
          </Tooltip>
        }
        unit="Total Deposits"
        variant="outlined"
        loading={loading || +isLoading || +isFetching}
      />
      <CustomStat
        loading={loading || +isLoading || +isFetching}
        value={
          <Tooltip
            title={totalBorrowed}
            disableHoverListener={totalBorrowed === '0'}
            placement="top"
            arrow
          >
            <Fragment>{`${formatCompactNumber(Number(totalBorrowed) * Number(ethPrice), { symbol: !displayEth })} ${displayEth ? 'ETH' : ''}`}</Fragment>
          </Tooltip>
        }
        unit="Total Borrowed"
        variant="outlined"
      />
    </ResponsiveStack>
  );
};

export default OverviewStatsMolecule;
