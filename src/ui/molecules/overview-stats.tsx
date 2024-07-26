import { styled } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import type { IPoolWithUnderlying } from '@augustdigital/sdk';
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
}: {
  pools?: IPoolWithUnderlying[];
}) => {
  const totalSupplied = useMemo(() => {
    if (!pools?.length) return '0.0 USDC';
    return pools[0]?.totalSupply.normalized;
    // return pools?.reduce((curr, acc) => {
    //   acc += BigInt(curr.totalSupply.raw);
    //   return acc;
    // }, BigInt(0));
  }, [pools?.length]);
  return (
    <ResponsiveStack>
      <CustomStat
        value={`${totalSupplied} USDC`}
        unit="Total Deposits"
        variant="outlined"
      />
      <CustomStat value="0.0 USDC" unit="Total Borrowed" variant="outlined" />
    </ResponsiveStack>
  );
};

export default OverviewStatsMolecule;
