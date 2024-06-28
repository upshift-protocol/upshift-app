import appConfig from '@/config/app';
import type { IChildren } from '@/utils/types';

import { Header } from './Header';
import { Meta } from './Meta';
import { CSSProperties } from 'react';

type IBase = IChildren & {
  style?: CSSProperties;
  title?: string;
  description?: string;
};

const Base = ({ children, style, title, description }: IBase) => {
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

export { Base };
