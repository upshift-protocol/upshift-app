import { Box, Stack, styled, Typography } from '@mui/material';
import type { ReactNode } from 'react';

import { STYLE_VARS } from '@/utils/constants';

type ISectionProps = {
  title?: string;
  description?: string;
  children: ReactNode;
  id?: string;
  action?: ReactNode;
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

const Section = (props: ISectionProps) => {
  return (
    <Box
      id={props?.id ?? props?.title?.toLowerCase().replaceAll(' ', '-')}
      p="2rem"
      maxWidth={STYLE_VARS.width}
      mx="auto"
    >
      {(props.title || props.description) && (
        <ResponsiveStack>
          <Box>
            {props.title && (
              <Typography variant="h2" mb={1}>
                {props.title}
              </Typography>
            )}
            {props.description && (
              <Typography variant="body1">{props.description}</Typography>
            )}
          </Box>
          {props?.action ? <Box flex="none">{props.action}</Box> : null}
        </ResponsiveStack>
      )}

      {props.children}
    </Box>
  );
};

export { Section };
