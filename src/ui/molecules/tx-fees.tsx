import { secondsToHours } from '@/utils/helpers/time';
import type { IPoolMetadata } from '@/utils/types';
import {
  round,
  toNormalizedBn,
  type IAddress,
  type IPoolAction,
} from '@augustdigital/sdk';
import { Skeleton, Stack, Typography } from '@mui/material';
import { useGasPrice, useChainId } from 'wagmi';
import { Suspense } from 'react';
import { getNativeTokenByChainId } from '@/utils/helpers/ui';
import BoxedListAtom from '../atoms/boxed-list';

type ITxFees = {
  function: IPoolAction;
  in?: IAddress;
  out?: IAddress;
  amount?: string | number;
  contract?: IAddress;
  fee?: bigint;
  loading?: number;
  pool?: IPoolMetadata;
  chainId?: number;
};

export default function TxFeesAtom(props: ITxFees) {
  const chainId = useChainId();
  const { data: gasPrice } = useGasPrice({ chainId: props?.chainId });
  const feeTotal = (gasPrice || BigInt(0)) * (props.fee || BigInt(0));

  function renderValue(value?: string, type?: 'lock' | 'gas') {
    switch (type) {
      case 'lock': {
        if (props.pool?.loading)
          return (
            <Skeleton
              style={{ display: 'inline-block', transform: 'translateY(2px)' }}
              width="100px"
              variant="text"
              height="14px"
            />
          );
        if (value && typeof value === 'string') {
          const hours = secondsToHours(value);
          if (hours === 0) return 'Immediately';
          return `${hours} ${hours === 1 ? 'hour' : 'hours'}`;
        }
        return 'Error getting lock period';
      }
      default: {
        if (props.loading)
          return (
            <Skeleton
              style={{ display: 'inline-block', transform: 'translateY(2px)' }}
              width="100px"
              variant="text"
              height="14px"
            />
          );
        if (typeof type === 'string')
          return `${value} ${getNativeTokenByChainId(chainId)}` || '-';
        return `${value} ${getNativeTokenByChainId(chainId)}` || '-';
      }
    }
  }

  function renderList() {
    switch (props.function) {
      case 'claim':
        return (
          <BoxedListAtom
            items={[
              {
                label: 'Gas Fee',
                value: renderValue(toNormalizedBn(feeTotal)?.normalized),
              },
            ]}
          />
        );
      case 'withdraw':
        return (
          <BoxedListAtom
            items={[
              {
                label: 'Gas Fee',
                value: renderValue(toNormalizedBn(feeTotal)?.normalized),
              },
              {
                label: 'Unstake Lock Period',
                value: renderValue(props?.pool?.lockTime?.normalized, 'lock'),
              },
            ]}
          />
        );
      case 'deposit': {
        const rounded = round(props?.pool?.apy || 0);
        return (
          <BoxedListAtom
            items={[
              {
                label: 'Gas Fee',
                value: renderValue(toNormalizedBn(feeTotal)?.normalized),
              },
              {
                label: 'Collateral Exposure',
                value: Array.isArray(props?.pool?.collateral)
                  ? props?.pool?.collateral?.join(', ')
                  : '-',
              },
              {
                label: 'Estimated APY',
                value:
                  rounded === '-'
                    ? '-'
                    : `${rounded !== 'NaN' ? rounded : '0.00'}%`,
              },
            ]}
          />
        );
      }
      default:
        return (
          <BoxedListAtom
            items={[
              {
                label: 'Gas Fee',
                value: renderValue(toNormalizedBn(feeTotal)?.normalized),
              },
            ]}
          />
        );
    }
  }

  return (
    <Suspense>
      <Stack gap={1}>
        <Typography variant="body2">Transaction Overview</Typography>
        {renderList()}
      </Stack>
    </Suspense>
  );
}
