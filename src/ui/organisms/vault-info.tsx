import { truncate } from '@/utils/helpers';
import type { IPool } from '@augustdigital/types';
import Grid from '@mui/material/Grid';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import LinkAtom from '../atoms/Link';

export default function VaultInfo(
  props: (IPool | undefined) & { loading: boolean },
) {
  return (
    <Stack gap={2} direction="column">
      <Typography variant="h6">Vault Info</Typography>
      <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 3, md: 6 }}>
        <Grid item xs={6}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography>Vault Address</Typography>
            {props.loading ? (
              <Skeleton variant="text" width={150} />
            ) : (
              <LinkAtom overflow="hidden">
                {truncate(props.address, 6)}
              </LinkAtom>
            )}
          </Stack>
        </Grid>
        <Grid item xs={6}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography>Curator</Typography>
            {props.loading ? (
              <Skeleton variant="text" width={150} />
            ) : (
              <LinkAtom overflow="hidden">
                {truncate(props.getLoansOperator, 6)}
              </LinkAtom>
            )}
          </Stack>
        </Grid>
        <Grid item xs={6}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography>Total Supply</Typography>
            {props.loading ? (
              <Skeleton variant="text" width={100} />
            ) : (
              <Typography>
                {props.totalSupply.normalized} {'USDC'} {/* TODO */}{' '}
              </Typography>
            )}
          </Stack>
        </Grid>
        <Grid item xs={6}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography>Net APY</Typography>
            {props.loading ? (
              <Skeleton variant="text" width={75} />
            ) : (
              <Typography>{'0.0%'}</Typography>
            )}
          </Stack>
        </Grid>
        <Grid item xs={6}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography>Performance Fee</Typography>
            {props.loading ? (
              <Skeleton variant="text" width={75} />
            ) : (
              <Typography>{'0.0%'}</Typography>
            )}
          </Stack>
        </Grid>
        <Grid item xs={6}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography>Liquidity</Typography>
            {props.loading ? (
              <Skeleton variant="text" width={100} />
            ) : (
              <Typography>
                {props.totalAssets.normalized} {'USDC'} {/* TODO */}
              </Typography>
            )}
          </Stack>
        </Grid>
      </Grid>
    </Stack>
  );
}
