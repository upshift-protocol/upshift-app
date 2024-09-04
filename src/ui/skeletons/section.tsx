import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { Fragment, type ReactNode } from 'react';

import { STYLE_VARS } from '@/utils/constants/ui';
import type { IBreadCumb } from '@/utils/types';
import { Skeleton } from '@mui/material';
import BreadCrumbs from '../atoms/breadcrumbs';

type ISectionProps = {
  title?: string;
  description?: string;
  children: ReactNode;
  id?: string;
  action?: ReactNode;
  breadcrumbs?: IBreadCumb[];
  loading?: number;
  noYPadding?: boolean;
};

const ResponsiveStack = styled(Stack)(({ theme }) => ({
  marginBottom: '2rem',
  justifyContent: 'space-between',
  [theme.breakpoints.down('lg')]: {
    flexDirection: 'column',
    gap: '12px',
  },
  [theme.breakpoints.up('lg')]: {
    flexDirection: 'row',
    gap: '12rem',
  },
}));

const SectionSkeleton = (props: ISectionProps) => {
  return (
    <Box
      id={props?.id ?? props?.title?.toLowerCase().replaceAll(' ', '-')}
      p={props.noYPadding ? '0 2rem' : '2rem'}
      maxWidth={STYLE_VARS.width}
      mx="auto"
    >
      {typeof props.breadcrumbs !== 'undefined' &&
      typeof props.title !== 'undefined' ? (
        <BreadCrumbs
          style={{ marginBottom: '1rem' }}
          crumbs={props.breadcrumbs}
          currentPage={props.title}
        />
      ) : null}

      {(props.title || props.description) && (
        <ResponsiveStack>
          <Box>
            {props.title && (
              <Fragment>
                {props.loading ? (
                  <Skeleton
                    variant="text"
                    style={{ transform: 'none', marginBottom: '1rem' }}
                    height={36}
                    width={300}
                  />
                ) : (
                  <Typography variant="h2" mb={2}>
                    {props.title}
                  </Typography>
                )}
              </Fragment>
            )}
            {props.description && (
              <Typography
                variant="body1"
                fontSize={18}
                maxWidth={STYLE_VARS.descriptionWidth}
              >
                {props.description}
              </Typography>
            )}
          </Box>
          {props?.action ? <Box flex="none">{props.action}</Box> : null}
        </ResponsiveStack>
      )}

      {props.children}
    </Box>
  );
};

export default SectionSkeleton;
