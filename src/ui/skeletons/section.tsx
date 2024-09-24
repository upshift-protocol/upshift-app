import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { Fragment, type ReactNode } from 'react';

import { STYLE_VARS } from '@/utils/constants/ui';
import type { IBreadCumb } from '@/utils/types';
import { Chip, Skeleton } from '@mui/material';
import { useChains } from 'wagmi';
import Image from 'next/image';
import { formatChainForImg } from '@/utils/helpers/ui';
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
  chainId?: number;
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
  const chains = useChains();
  return (
    <Box
      id={props?.id ?? props?.title?.toLowerCase().replaceAll(' ', '-')}
      p={
        props.noYPadding
          ? { xs: '0 1rem', md: '0 2rem' }
          : { xs: '1rem', md: '2rem' }
      }
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
                <Stack direction={'row'} gap={{ xs: 2, sm: 3, md: 4 }}>
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
                  {props?.chainId ? (
                    <Chip
                      label={
                        <span
                          style={{
                            display: 'flex',
                            gap: '6px',
                            alignItems: 'center',
                          }}
                        >
                          <Image
                            src={
                              formatChainForImg(props?.chainId, chains)
                                .formatted
                            }
                            alt={String(props.chainId)}
                            height={16}
                            width={16}
                          />
                          <span>
                            {chains?.find((c) => c.id === props.chainId)
                              ?.name || props.chainId}
                          </span>
                        </span>
                      }
                      color="info"
                      variant="outlined"
                    />
                  ) : null}
                </Stack>
              </Fragment>
            )}
            {(props.description || props?.loading) && (
              <Fragment>
                {props.loading ? (
                  <Stack marginBottom={1} gap={1}>
                    <Skeleton
                      variant="text"
                      style={{ transform: 'none' }}
                      width={'100%'}
                      height={18}
                    />
                  </Stack>
                ) : (
                  <Typography
                    variant="body1"
                    maxWidth={STYLE_VARS.descriptionWidth}
                    marginBottom={1}
                  >
                    {props.description}
                  </Typography>
                )}
              </Fragment>
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
