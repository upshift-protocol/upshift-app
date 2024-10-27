import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import appConfig from '@/config/app';
import Stack from '@mui/material/Stack';
import Image from 'next/image';
import Link from 'next/link';
import { styled } from '@mui/material';
import { STYLE_VARS } from '@/utils/constants/ui';

const StyledLink = styled(Link)`
  display: flex;
  font-size: 12px;
  gap: 6px;
  text-decoration: none;
  color: inherit;
`;

const FooterSkeleton = () => (
  <footer>
    <Stack
      paddingY={'1rem'}
      paddingX={{ xs: '16px', sm: '24px' }}
      direction={{ sm: 'row' }}
      justifyContent={'space-between'}
      alignItems={{ xs: 'center', sm: 'inherit' }}
      maxWidth={STYLE_VARS.widthWide}
      margin={'0 auto'}
    >
      <Box>
        <StyledLink href="https://augustdigital.io" target="_blank">
          Powered by August
          <Image
            src="/img/august-logo-blue.svg"
            alt="August Digital"
            height={16}
            width={16}
          />
        </StyledLink>
      </Box>
      <Box>
        <Typography fontSize={12}>
          Copyright &copy; {new Date().getFullYear()} {appConfig.site_name}
        </Typography>
      </Box>
    </Stack>
  </footer>
);

export default FooterSkeleton;
