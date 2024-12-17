import { truncate } from '@/utils/helpers/string';
import { explorerLink } from '@augustdigital/sdk';
import type {
  IAddress,
  IChainId,
  IPoolWithUnderlying,
} from '@augustdigital/sdk';
import Grid from '@mui/material/Grid';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { FALLBACK_CHAINID } from '@/utils/constants';
import { Chip, Tooltip } from '@mui/material';
import { renderBiggerApy } from '@/utils/helpers/ui';
import { getTooltip } from '@/utils/constants/tooltips';
import LinkAtom from '../atoms/anchor-link';
import AmountDisplay from '../atoms/amount-display';

export default function VaultInfo(
  props: (IPoolWithUnderlying | undefined) & { loading?: boolean },
) {
  const renderedApy = renderBiggerApy('', props.apy);
  const tooltipText = getTooltip(props?.name?.toLocaleLowerCase());
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
                href={explorerLink(
                  props?.address,
                  (props?.chainId as IChainId) || FALLBACK_CHAINID,
                  'address',
                )}
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
                  (props?.hardcodedStrategist ||
                    props.loansOperator) as IAddress,
                  (props?.chainId as IChainId) || FALLBACK_CHAINID,
                  'address',
                )}
              >
                {truncate(
                  props?.hardcodedStrategist || props?.loansOperator || '',
                  6,
                )}
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
            <Typography>TVL</Typography>
            {props?.loading ? (
              <Skeleton variant="text" width={100} />
            ) : (
              <Stack direction="row" gap={1}>
                <AmountDisplay
                  symbol={props?.underlying?.symbol}
                  round
                  usd
                  direction="row"
                >
                  {props?.totalSupply?.normalized}
                </AmountDisplay>
              </Stack>
            )}
          </Stack>
        </Grid>
        <Grid item xs={6}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography>Avg. APY</Typography>
            {props?.loading ? (
              <Skeleton variant="text" width={75} />
            ) : (
              <Tooltip
                title={tooltipText}
                disableHoverListener={!tooltipText}
                placement="top"
                arrow
              >
                <Typography display="flex">{renderedApy}</Typography>
              </Tooltip>
            )}
          </Stack>
        </Grid>
        <Grid item xs={6}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography>Withdrawal Fee</Typography>
            {props?.loading ? (
              <Skeleton variant="text" width={75} />
            ) : (
              <span style={{ display: 'flex' }}>
                {BigInt(props?.withdrawalFee?.raw || 0) === BigInt(0) ? (
                  <Chip
                    label={'None'}
                    color={'success'}
                    variant="outlined"
                    size="small"
                    sx={{ lineHeight: 1.2 }}
                  />
                ) : (
                  <>
                    <AmountDisplay
                      round
                    >{`${(Number(props?.withdrawalFee?.normalized) / 100).toFixed(2) || `0.00`}`}</AmountDisplay>
                    %
                  </>
                )}
              </span>
            )}
          </Stack>
        </Grid>
        {/* <Grid item xs={6}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography>Available Liquidity</Typography>
            {props?.loading ? (
              <Skeleton variant="text" width={100} />
            ) : (
              <AmountDisplay
                symbol={props?.underlying?.symbol}
                usd
                direction="row"
                round
              >
                {Number(props?.totalAssets?.normalized) -
                  Number(props?.globalLoansAmount?.normalized)}
              </AmountDisplay>
            )}
          </Stack>
        </Grid> */}
      </Grid>
    </Stack>
  );
}
