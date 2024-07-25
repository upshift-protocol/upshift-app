import { useThemeMode } from '@/stores/theme';
import type { ITheme } from '@/utils/types';
import {
  toNormalizedBn,
  type IAddress,
  type IPoolAction,
} from '@augustdigital/sdk';
import { Skeleton, Stack, styled, Typography } from '@mui/material';
import { Fragment } from 'react';
import { useGasPrice } from 'wagmi';

type ITxFees = {
  function: IPoolAction;
  in?: IAddress;
  out?: IAddress;
  amount?: string | number;
  contract?: IAddress;
  fee?: bigint;
  loading?: boolean;
};

const StackOutline = styled(Stack)<{ thememode: ITheme }>`
  border-radius: 4px;
  padding: 0.5rem 1rem;
  gap: 6px;
  border: 1px solid
    ${({ thememode }) =>
      thememode === 'dark' ? 'rgba(255,255,255,0.23)' : 'rgba(0,0,0,0.23)'};
`;

const StackRow = styled(Stack)`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export default function TxFeesAtom(props: ITxFees) {
  const { theme } = useThemeMode();

  const { data: gasPrice } = useGasPrice();
  const feeTotal = (gasPrice || BigInt(0)) * (props.fee || BigInt(0));

  function renderGasFee() {
    if (props.loading)
      return (
        <Skeleton
          style={{ display: 'inline-block', transform: 'translateY(2px)' }}
          width="100px"
          variant="text"
          height="14px"
        />
      );
    return <Fragment>{toNormalizedBn(feeTotal)?.normalized || '-'}</Fragment>;
  }

  function renderList() {
    switch (props.function) {
      case 'claim':
        return (
          <StackOutline thememode={theme}>
            <StackRow>
              <Typography variant="body2">Gas Fee</Typography>
              <Typography variant="body2" fontFamily="monospace">
                {renderGasFee()} ETH
              </Typography>
            </StackRow>
          </StackOutline>
        );
      case 'withdraw':
        return (
          <StackOutline thememode={theme}>
            <StackRow>
              <Typography variant="body2">Gas Fee</Typography>
              <Typography variant="body2" fontFamily="monospace">
                {renderGasFee()} ETH
              </Typography>
            </StackRow>
          </StackOutline>
        );
      case 'deposit':
        return (
          <StackOutline thememode={theme}>
            <StackRow>
              <Typography variant="body2">Gas Fee</Typography>
              <Typography variant="body2" fontFamily="monospace">
                {renderGasFee()} ETH
              </Typography>
            </StackRow>
            <StackRow>
              <Typography variant="body2">Collateral Exposure</Typography>
              <Typography variant="body2" fontFamily="monospace">
                {'-'}
              </Typography>
            </StackRow>
            <StackRow>
              <Typography variant="body2">Estimated APY</Typography>
              <Typography variant="body2" fontFamily="monospace">
                {'-'}
              </Typography>
            </StackRow>
          </StackOutline>
        );
      default:
        return (
          <StackOutline thememode={theme}>
            <StackRow>
              <Typography variant="body2">Gas Fee</Typography>
              <Typography variant="body2" fontFamily="monospace">
                {renderGasFee()} ETH
              </Typography>
            </StackRow>
          </StackOutline>
        );
    }
  }

  return (
    <Stack gap={1}>
      <Typography variant="body2">Transaction Overview</Typography>
      {renderList()}
    </Stack>
  );
}
