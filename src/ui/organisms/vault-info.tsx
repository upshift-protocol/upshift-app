import React from 'react';
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
import { TOOLTIP_MAPPING } from '@/utils/constants/tooltips';
import { getStrategyDetails } from '@/utils/constants/static';

import { useReadContract } from 'wagmi';
import { useStaking } from '@/stores/stake';
import LinkAtom from '../atoms/anchor-link';
import AmountDisplay from '../atoms/amount-display';

export default function VaultInfo(
  props: (IPoolWithUnderlying | undefined) & { loading?: boolean },
) {
  const renderedApy = renderBiggerApy('', props.apy);

  const staticData = getStrategyDetails(props?.name?.toLocaleLowerCase());

  const { data: managementFeePercent, isLoading } = useReadContract({
    address: props.address,
    abi: [
      {
        inputs: [],
        name: 'managementFeePercent',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
      },
    ],
    functionName: 'managementFeePercent',
    chainId: props?.chainId,
  });

  const tooltipText = TOOLTIP_MAPPING?.[props?.name?.toLocaleLowerCase()];

  const { stakingPositions } = useStaking();

  const stakePosition = stakingPositions.find(
    (stake) =>
      stake.stakingToken.name.toLocaleLowerCase() ===
      props?.name?.toLocaleLowerCase(),
  );

  const maxApyValue =
    stakePosition?.maxApy !== undefined
      ? stakePosition.maxApy.toFixed(2)
      : 'N/A';

  const totalApyValue =
    stakePosition?.maxApy !== undefined
      ? `${(stakePosition.maxApy + Number(props?.apy)).toFixed(2)}%`
      : 'N/A';

  if (staticData?.additionalFields) {
    staticData.additionalFields = staticData.additionalFields.map((field) => {
      if (field.label === 'Avax incentives APR') {
        return { ...field, value: maxApyValue };
      }
      if (field.label === 'Total APY') {
        return { ...field, value: totalApyValue };
      }
      return field;
    });
  }

  return (
    <Stack gap={2} direction="column">
      <Typography variant="h6">Vault Info</Typography>
      <Grid container spacing={2}>
        {/* Left Column */}
        <Grid item xs={12} md={6}>
          <Stack gap={2}>
            {/* Vault Address */}
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

            {/* TVL */}
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

            {/* Withdrawal Fee */}
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

            {/* Management Fee */}
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography>Management Fee</Typography>
              {isLoading ? (
                <Skeleton variant="text" width={100} />
              ) : (
                <AmountDisplay direction="row">
                  {managementFeePercent
                    ? `${Number(managementFeePercent) / 100}%`
                    : '2%'}
                </AmountDisplay>
              )}
            </Stack>
          </Stack>
        </Grid>

        {/* Right Column */}
        <Grid item xs={12} md={6}>
          <Stack gap={2}>
            {/* Strategist */}
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

            {/* Avg. APY */}
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
                  title={
                    <Typography fontSize={'16px'}>{tooltipText}</Typography>
                  }
                  disableHoverListener={!tooltipText}
                  placement="top"
                  arrow
                >
                  <Typography display="flex">{renderedApy}</Typography>
                </Tooltip>
              )}
            </Stack>

            {staticData &&
            Array.isArray(staticData.additionalFields) &&
            staticData.additionalFields.length
              ? staticData.additionalFields.map(({ label, value }, index) => (
                  <React.Fragment key={index}>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Typography>{label}</Typography>
                      {props?.loading ? (
                        <Skeleton variant="text" width={75} />
                      ) : (
                        <Tooltip
                          title={
                            <Typography fontSize={'16px'}>
                              {tooltipText}
                            </Typography>
                          }
                          disableHoverListener={!tooltipText}
                          placement="top"
                          arrow
                        >
                          <Typography display="flex">{value}</Typography>
                        </Tooltip>
                      )}
                    </Stack>
                  </React.Fragment>
                ))
              : null}
          </Stack>
        </Grid>
      </Grid>
    </Stack>
  );
}
