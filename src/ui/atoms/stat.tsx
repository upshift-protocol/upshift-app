import { useThemeMode } from '@/stores/theme';
import { Skeleton } from '@mui/material';
import { styled, useThemeProps } from '@mui/material/styles';
import * as React from 'react';

export interface StatProps {
  value: number | string | React.ReactNode;
  unit: string;
  variant?: 'outlined' | 'inverse';
  loading?: number;
}

interface StatOwnerState extends StatProps {
  // …key value pairs for the internal state that you want to style the slot
  // but don't want to expose to the users
}

const StatRoot = styled('div', {
  name: 'MuiStat',
  slot: 'root',
})<{ ownerState: StatOwnerState; isdark?: boolean }>(
  ({ theme, ownerState, isdark }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'end',
    gap: theme.spacing(0.5),
    padding: theme.spacing(3, 4),
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[2],
    letterSpacing: '-0.025em',
    fontWeight: 600,
    ...(ownerState.variant === 'outlined' && {
      border: `2px solid ${theme.palette.divider}`,
      boxShadow: 'none',
    }),
    ...(ownerState.variant === 'inverse' && {
      backgroundColor: isdark
        ? theme.palette.common.white
        : theme.palette.common.black,
      color: isdark ? theme.palette.common.black : theme.palette.common.white,
      boxShadow: '0px 0px 8px 0px rgba(255,255,255,1)',
    }),
  }),
);

const StatValue = styled('div', {
  name: 'MuiStat',
  slot: 'value',
})<{ ownerState: StatOwnerState; isdark?: boolean }>(
  ({ theme, ownerState, isdark }) => ({
    ...theme.typography.h4,
    fontSize: '2.25rem',
    ...(ownerState.variant === 'inverse' && {
      boxShadow: 'none',
      color: isdark ? theme.palette.common.black : theme.palette.common.white,
    }),
  }),
);

const StatUnit = styled('div', {
  name: 'MuiStat',
  slot: 'unit',
})<{ ownerState: StatOwnerState; isdark?: boolean }>(
  ({ theme, ownerState, isdark }) => ({
    ...theme.typography.body2,
    textTransform: 'uppercase',
    color: theme.palette.text.secondary,
    ...(ownerState.variant === 'inverse' && {
      boxShadow: 'none',
      color: isdark ? theme.palette.common.black : theme.palette.grey[300],
    }),
  }),
);

const StatAtom = React.forwardRef<HTMLDivElement, StatProps>(
  function Stat(inProps, ref) {
    const { isDark } = useThemeMode();
    const props = useThemeProps({ props: inProps, name: 'MuiStat' });
    const { value, unit, variant, ...other } = props;

    const ownerState = { ...props, variant };

    return (
      <StatRoot
        ref={ref}
        ownerState={ownerState}
        {...other}
        style={{ minWidth: '300px' }}
        isdark={isDark}
      >
        {props.loading ? (
          <Skeleton
            variant="rounded"
            width="100%"
            height="38px"
            style={{ marginBottom: '6px', backgroundColor: 'gray' }}
          />
        ) : (
          <StatValue
            ownerState={ownerState}
            style={{ fontFamily: 'monospace' }}
            isdark={isDark}
          >
            {value}
          </StatValue>
        )}
        <StatUnit isdark={isDark} ownerState={ownerState}>
          {unit}
        </StatUnit>
      </StatRoot>
    );
  },
);

export default StatAtom;
