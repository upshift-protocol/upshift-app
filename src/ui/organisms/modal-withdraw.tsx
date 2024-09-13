import Stack from '@mui/material/Stack';
import type { IChainId, IPoolWithUnderlying } from '@augustdigital/sdk';
import useInput from '@/hooks/use-input';
import useWithdraw from '@/hooks/use-withdraw';
import { Card, Typography, useTheme } from '@mui/material';
import ModalAtom from '../atoms/modal';
import AssetInputMolecule from '../molecules/asset-input';
import Web3Button from '../atoms/web3-button';
import TxFeesAtom from '../molecules/tx-fees';

export default function WithdrawModalMolecule(props?: IPoolWithUnderlying) {
  const { palette } = useTheme();
  const inInputProps = useInput(props?.address, props?.chainId as IChainId);
  const { requestWithdraw, isSuccess, button, expected, pool } = useWithdraw({
    ...inInputProps,
    asset: props?.asset,
    pool: props?.address,
    chainId: props?.chainId as IChainId,
  });

  return (
    <ModalAtom
      title="Withdraw"
      buttonProps={{
        children: 'Request Redeem',
        variant: 'outlined',
        color: 'error',
        disabled: !props?.address,
      }}
      onClose={inInputProps.clearInput}
      closeWhen={isSuccess}
    >
      <Stack spacing={2} position="relative">
        <AssetInputMolecule
          {...inInputProps}
          chainId={props?.chainId as IChainId}
          address={props?.address}
          type="In"
        />
        <AssetInputMolecule
          address={props?.underlying?.address}
          type="Out"
          value={expected.loading ? ' ' : expected.out.normalized}
          loading={+expected.loading}
          chainId={props?.chainId as IChainId}
        />
        <TxFeesAtom
          function="withdraw"
          out={props?.underlying?.address}
          in={props?.address}
          fee={BigInt(expected.fee.raw)}
          loading={+expected.loading}
          pool={pool}
        />
        <Card
          sx={{
            padding: '1rem',
            bgcolor: palette.warning.main,
            color: 'black',
          }}
        >
          <Stack direction="row" alignItems="center" gap={1}>
            <svg
              clipRule="evenodd"
              fillRule="evenodd"
              strokeLinejoin="round"
              strokeMiterlimit="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              width={36}
              height={36}
            >
              <path
                d="m12.002 21.534c5.518 0 9.998-4.48 9.998-9.998s-4.48-9.997-9.998-9.997c-5.517 0-9.997 4.479-9.997 9.997s4.48 9.998 9.997 9.998zm0-1.5c-4.69 0-8.497-3.808-8.497-8.498s3.807-8.497 8.497-8.497 8.498 3.807 8.498 8.497-3.808 8.498-8.498 8.498zm0-6.5c-.414 0-.75-.336-.75-.75v-5.5c0-.414.336-.75.75-.75s.75.336.75.75v5.5c0 .414-.336.75-.75.75zm-.002 3c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1z"
                fillRule="nonzero"
              />
            </svg>
            <Typography variant="body2">
              Claims will be processed once a day and the assets will be
              transferred directly to your wallet address.
            </Typography>
          </Stack>
        </Card>
        <Web3Button
          style={{ marginTop: '1rem' }}
          size="large"
          variant="contained"
          onClick={requestWithdraw}
          disabled={button.disabled || pool?.loading}
          chainId={props?.chainId}
        >
          {button.text}
        </Web3Button>
      </Stack>
    </ModalAtom>
  );
}
