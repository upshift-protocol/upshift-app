import type { IBreadCumb } from '@/utils/types';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import type { CSSProperties } from 'react';

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
        <Link
          key={`breadcrumb-${i}`}
          underline="hover"
          href={c.href}
          style={{ opacity: '0.75' }}
        >
          {c.text}
        </Link>
      ))}
      <Link underline={'none'}>{currentPage}</Link>
    </Breadcrumbs>
  );
}
