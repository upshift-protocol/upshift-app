import Link from 'next/link';
import MUILink from '@mui/material/Link';
import type { CSSProperties, ReactNode } from 'react';
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

export default function LinkAtom(props: ILinkAtom) {
  return (
    <Link
      href={props.href || '#'}
      target={props.target}
      style={{ textDecoration: 'none', ...props.style }}
    >
      <MUILink
        overflow={props.overflow}
        underline={props?.underline}
        style={props.style}
      >
        {props.children}
      </MUILink>
    </Link>
  );
}
