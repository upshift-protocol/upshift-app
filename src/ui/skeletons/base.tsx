import appConfig from '@/config/app';
import type { IChildren } from '@/utils/types';

import type { CSSProperties } from 'react';
import NextNProgress from 'nextjs-progressbar';
import { useThemeMode } from '@/stores/theme';
import { darkTheme, lightTheme } from '@/config/mui-theme';
import { Box, Stack } from '@mui/material';
import Header from './header';
import Meta from './meta';
import FooterSkeleton from './footer';

type IBase = IChildren & {
  style?: CSSProperties;
  title?: string;
  description?: string;
};

const BaseSkeleton = ({ children, style, title, description }: IBase) => {
  const { theme } = useThemeMode();
  return (
    <>
      <NextNProgress
        color={
          theme === 'dark'
            ? darkTheme.palette.primary.main
            : lightTheme.palette.primary.main
        }
      />

      <Meta
        title={title ?? appConfig.title}
        description={description ?? appConfig.description}
      />

      <Box style={style} position={'relative'} minHeight={'100vh'}>
        <Header />
        <Box paddingBottom={'4rem'}>
          <main>{children}</main>
        </Box>
        <Stack
          height={'4rem'}
          position={'absolute'}
          bottom={'0'}
          width={'100%'}
          justifyContent={'end'}
          alignItems={{ xs: 'center', sm: 'inherit' }}
        >
          <FooterSkeleton />
        </Stack>
      </Box>
    </>
  );
};

export default BaseSkeleton;
