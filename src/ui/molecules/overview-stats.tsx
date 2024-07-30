import { styled } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import { toNormalizedBn, type IPoolWithUnderlying } from '@augustdigital/sdk';
import { useMemo } from 'react';
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
    return toNormalizedBn(total, 6).normalized;
  }, [pools?.length]);
  return (
    <ResponsiveStack>
      <CustomStat
        value={`${totalSupplied} USDC`}
        unit="Total Deposits"
        variant="outlined"
        loading={loading}
      />
      <CustomStat
        loading={loading}
        value="0.0 USDC"
        unit="Total Borrowed"
        variant="outlined"
      />
    </ResponsiveStack>
  );
};

export default OverviewStatsMolecule;
