import appConfig from '@/config/app';
import type { IChildren } from '@/utils/types';

import type { CSSProperties } from 'react';
import Header from './header';
import Meta from './meta';

type IBase = IChildren & {
  style?: CSSProperties;
  title?: string;
  description?: string;
};

const BaseSkeleton = ({ children, style, title, description }: IBase) => {
  return (
    <div style={style}>
      <Meta
        title={title ?? appConfig.title}
        description={description ?? appConfig.description}
      />

      <Header />
      <main>{children}</main>
      {/* <Footer /> */}
    </div>
  );
};

export default BaseSkeleton;
