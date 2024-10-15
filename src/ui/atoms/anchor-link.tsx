import MUILink from '@mui/material/Link';
import type { CSSProperties, ReactNode } from 'react';
import type { IHrefTarget } from '@/utils/types';
import Link from 'next/link';
import Typography from '@mui/material/Typography';
import { dinCondensed } from '@/config/fonts';

type ILinkAtom = {
  href: string;
  children: string | ReactNode;
  underline?: 'always' | 'hover' | 'none';
  key?: string;
  style?: CSSProperties;
  overflow?: 'hidden' | 'auto' | 'clip';
  target?: IHrefTarget;
  noSpan?: boolean;
};

export default function LinkAtom(props: ILinkAtom) {
  return (
    <MUILink
      overflow={props.overflow}
      underline={props?.underline}
      fontFamily={dinCondensed.style.fontFamily}
      style={props.style}
      href={props.href}
      target={props.target || '_blank'}
      component={Link}
      rel={!props.target ? 'noreferrer' : undefined}
    >
      {props?.noSpan ? (
        props?.children
      ) : (
        <Typography
          component={'span'}
          fontFamily={dinCondensed.style.fontFamily}
        >
          {props.children}
        </Typography>
      )}
    </MUILink>
  );
}
