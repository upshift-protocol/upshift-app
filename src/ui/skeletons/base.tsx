import appConfig from '@/config/app';
import type { IChildren } from '@/utils/types';

import type { CSSProperties } from 'react';
import NextNProgress from 'nextjs-progressbar';
import { useThemeMode } from '@/stores/theme';
import { darkTheme, lightTheme } from '@/config/mui-theme';
import Header from './header';
import Meta from './meta';

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

      <div style={style}>
        <Meta
          title={title ?? appConfig.title}
          description={description ?? appConfig.description}
        />

        <Header />
        <main>{children}</main>
        {/* <Footer /> */}
      </div>
    </>
  );
};

export default BaseSkeleton;
