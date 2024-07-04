import { truncate } from '@/utils/helpers';
import type { IPool } from '@augustdigital/types';
import { Grid, Link, Stack, Typography } from '@mui/material';

export default function VaultInfo(props: IPool | undefined) {
  if (typeof props?.address === 'undefined') {
    return null;
  }
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
            <Link overflow="hidden">{truncate(props.address, 6)}</Link>
          </Stack>
        </Grid>
        <Grid item xs={6}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography>Curator</Typography>
            <Link overflow="hidden">{truncate(props.getLoansOperator, 6)}</Link>
          </Stack>
        </Grid>
        <Grid item xs={6}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography>Total Supply</Typography>
            <Typography>{props.totalSupply.normalized}</Typography>
          </Stack>
        </Grid>
        <Grid item xs={6}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography>Net APY</Typography>
            <Typography>{'0.0%'}</Typography>
          </Stack>
        </Grid>
        <Grid item xs={6}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography>Performance Fee</Typography>
            <Typography>{'0.0%'}</Typography>
          </Stack>
        </Grid>
        <Grid item xs={6}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography>Liquidity</Typography>
            <Typography>
              {props.totalAssets.normalized} {'USDC'} {/* TODO */}
            </Typography>
          </Stack>
        </Grid>
      </Grid>
    </Stack>
  );
}
