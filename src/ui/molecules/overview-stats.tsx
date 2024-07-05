import { styled } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
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

const OverviewStatsMolecule = () => {
  return (
    <ResponsiveStack>
      <CustomStat value="$2,956,234" unit="Total Deposits" variant="outlined" />
      <CustomStat value="$2,956,234" unit="Total Borrowed" variant="outlined" />
    </ResponsiveStack>
  );
};

export default OverviewStatsMolecule;
