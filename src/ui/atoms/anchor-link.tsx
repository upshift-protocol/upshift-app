import NextLink from 'next/link';
import MUILink from '@mui/material/Link';
import { forwardRef } from 'react';
import type { ForwardedRef, CSSProperties, ReactNode } from 'react';
import type { IHrefTarget } from '@/utils/types';

type ILinkAtom = {
  href?: string;
  children: string | ReactNode;
  underline?: 'always' | 'hover' | 'none';
  key?: string;
  style?: CSSProperties;
  overflow?: 'hidden' | 'auto' | 'clip';
  target?: IHrefTarget;
};

const LinkBehaviour = forwardRef(function LinkBehaviour(
  props: any,
  ref: ForwardedRef<HTMLAnchorElement>,
) {
  return <NextLink ref={ref} href={props.href || '/#'} {...props} />;
});

export default function LinkAtom(props: ILinkAtom) {
  return (
    <MUILink
      overflow={props.overflow}
      underline={props?.underline}
      style={props.style}
      component={LinkBehaviour}
    >
      {props.children}
    </MUILink>
  );
}
