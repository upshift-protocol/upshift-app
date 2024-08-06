import { truncate } from '@/utils/helpers/string';
import { explorerLink, type IPoolWithUnderlying } from '@augustdigital/sdk';
import Grid from '@mui/material/Grid';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { FALLBACK_CHAINID } from '@/utils/constants/web3';
import LinkAtom from '../atoms/anchor-link';
import AmountDisplay from '../atoms/amount-display';

export default function VaultInfo(
  props: (IPoolWithUnderlying | undefined) & { loading?: boolean },
) {
  return (
    <Stack gap={2} direction="column">
      <Typography variant="h6">Vault Info</Typography>
      <Grid
        container
        rowSpacing={2}
        columnSpacing={{ xs: 1, sm: 3, md: 6 }}
        columns={{ xs: 2, sm: 12 }}
      >
        <Grid item xs={6}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography>Vault Address</Typography>
            {props?.loading ? (
              <Skeleton variant="text" width={150} />
            ) : (
              <LinkAtom
                overflow="hidden"
                href={explorerLink(props?.address, FALLBACK_CHAINID, 'address')}
              >
                {truncate(props?.address, 6)}
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
            <Typography>Strategist</Typography>
            {props?.loading ? (
              <Skeleton variant="text" width={150} />
            ) : (
              <LinkAtom
                overflow="hidden"
                href={explorerLink(
                  props?.loansOperator,
                  FALLBACK_CHAINID,
                  'address',
                )}
              >
                {truncate(props?.loansOperator, 6)}
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
            {props?.loading ? (
              <Skeleton variant="text" width={100} />
            ) : (
              <AmountDisplay symbol={props?.underlying?.symbol} round>
                {props?.totalSupply?.normalized}
              </AmountDisplay>
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
            {props?.loading ? (
              <Skeleton variant="text" width={75} />
            ) : (
              <AmountDisplay>{`${props?.apy?.normalized || '0.00'}%`}</AmountDisplay>
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
            {props?.loading ? (
              <Skeleton variant="text" width={75} />
            ) : (
              <AmountDisplay>{`0.00%`}</AmountDisplay>
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
            {props?.loading ? (
              <Skeleton variant="text" width={100} />
            ) : (
              <AmountDisplay symbol={props?.underlying?.symbol} round>
                {props?.totalAssets?.normalized}
              </AmountDisplay>
            )}
          </Stack>
        </Grid>
      </Grid>
    </Stack>
  );
}
