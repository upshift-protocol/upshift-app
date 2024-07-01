import { styled } from '@mui/material/styles';
import Stack from '@mui/material/Stack';

import { Stat } from '../components/stat';

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

export const OverallStats = () => {
  return (
    <ResponsiveStack>
      <Stat value="$2, 956, 234" unit="Total Deposits" variant="outlined" />
      <Stat value="$2, 956, 234" unit="Total Borrowed" variant="outlined" />
    </ResponsiveStack>
  );
};
