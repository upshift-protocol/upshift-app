import appConfig from '@/config/app';
import type { IChildren, ITailwindClass } from '@/utils/types';

import { Header } from './Header';
import { Meta } from './Meta';

type IBase = IChildren & {
  className?: ITailwindClass;
  title?: string;
  description?: string;
};

const Base = ({ children, className, title, description }: IBase) => {
  return (
    <div className={className}>
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
