import type { IBreadCumb } from '@/utils/types';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import type { CSSProperties } from 'react';
import LinkAtom from './anchor-link';

export default function BreadCrumbs({
  crumbs,
  currentPage,
  style,
}: {
  crumbs: IBreadCumb[];
  currentPage: string;
  style?: CSSProperties;
}) {
  return (
    <Breadcrumbs aria-label="breadcrumb" style={style}>
      {crumbs.map((c, i) => (
        <LinkAtom
          key={`breadcrumb-${i}`}
          underline="hover"
          href={c.href}
          style={{ opacity: '0.8' }}
        >
          {c.text}
        </LinkAtom>
      ))}
      <LinkAtom underline={'none'} style={{ cursor: 'default' }}>
        {currentPage}
      </LinkAtom>
    </Breadcrumbs>
  );
}
