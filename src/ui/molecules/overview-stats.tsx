import { styled } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import { toNormalizedBn, type IPoolWithUnderlying } from '@augustdigital/sdk';
import { Fragment, useMemo } from 'react';
import { formatUsd } from '@/utils/helpers/ui';
import { usePricesStore } from '@/stores/prices';
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
  const {
    prices: { data: tokens, isLoading },
  } = usePricesStore();

  const totalSupplied = useMemo(() => {
    if (!pools?.length) return '0.0';
    let total = 0;
    pools?.forEach(({ totalSupply, underlying }) => {
      const foundToken = tokens?.find((t) => t.address === underlying.address);
      total += Number(totalSupply?.normalized || 0) * (foundToken?.price || 0);
    });
    return String(total);
  }, [pools?.length, tokens?.length]);

  const totalBorrow = useMemo(() => {
    if (!pools?.length) return '0.0';
    let total = 0;
    pools?.forEach(({ globalLoansAmount, underlying }) => {
      const foundToken = tokens?.find((t) => t.address === underlying.address);
      total +=
        Number(globalLoansAmount?.normalized || 0) * (foundToken?.price || 0);
    });
    // TODO: return USD amount
    return toNormalizedBn(total).normalized;
  }, [pools?.length, tokens?.length]);

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
            <Fragment>{`${formatUsd(Number(totalSupplied))}`}</Fragment>
          </Tooltip>
        }
        unit="Total Deposited"
        variant="inverse"
        loading={loading || +isLoading}
      />
      <CustomStat
        loading={loading || +isLoading}
        value={
          <Tooltip
            title={totalBorrow}
            disableHoverListener={totalBorrow === '0'}
            placement="top"
            arrow
          >
            <Fragment>{`${formatUsd(Number(totalBorrow))}`}</Fragment>
          </Tooltip>
        }
        unit="Total Borrowed"
        variant="inverse"
      />
    </ResponsiveStack>
  );
};

export default OverviewStatsMolecule;
