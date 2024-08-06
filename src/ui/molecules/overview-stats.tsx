import { styled } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import {
  toNormalizedBn,
  round,
  type IPoolWithUnderlying,
} from '@augustdigital/sdk';
import { Fragment, useMemo } from 'react';
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
  const totalSupplied = useMemo(() => {
    if (!pools?.length) return '0.0';
    let total = BigInt(0);
    pools.forEach(({ totalSupply }) => {
      total += totalSupply.raw;
    });
    // TODO: return USD amount
    return toNormalizedBn(total).normalized;
  }, [pools?.length]);

  const totalBorrowed = useMemo(() => {
    if (!pools?.length) return '0.0';
    let total = BigInt(0);
    pools.forEach((p) => {
      total += p.totalBorrowed?.raw || BigInt(0);
    });
    // TODO: return USD amount
    return toNormalizedBn(total).normalized;
  }, [pools?.length]);
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
            <Fragment>{`${round(totalSupplied)} ETH`}</Fragment>
          </Tooltip>
        }
        unit="Total Deposits"
        variant="outlined"
        loading={loading}
      />
      <CustomStat
        loading={loading}
        value={
          <Tooltip
            title={totalBorrowed}
            disableHoverListener={totalBorrowed === '0'}
            placement="top"
            arrow
          >
            <Fragment>{`${round(totalBorrowed)} ETH`}</Fragment>
          </Tooltip>
        }
        unit="Total Borrowed"
        variant="outlined"
      />
    </ResponsiveStack>
  );
};

export default OverviewStatsMolecule;
