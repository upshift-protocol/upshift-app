import Stack from '@mui/material/Stack';
import type { IPoolWithUnderlying } from '@augustdigital/sdk';
import useInput from '@/hooks/use-input';
import useWithdraw from '@/hooks/use-withdraw';
import ModalAtom from '../atoms/modal';
import AssetInputMolecule from '../molecules/asset-input';
import Web3Button from '../atoms/web3-button';
import TxFeesAtom from '../molecules/tx-fees';

export default function WithdrawModalMolecule(props?: IPoolWithUnderlying) {
  const inInputProps = useInput(props?.address);
  const { requestWithdraw, isSuccess, button, expected, pool } = useWithdraw({
    ...inInputProps,
    asset: props?.asset,
    pool: props?.address,
  });

  return (
    <ModalAtom
      title="Withdraw"
      buttonProps={{
        children: 'Withdraw',
        variant: 'outlined',
        color: 'error',
      }}
      onClose={inInputProps.clearInput}
      closeWhen={isSuccess}
    >
      <Stack spacing={2} position="relative">
        <AssetInputMolecule
          {...inInputProps}
          address={props?.address}
          type="In"
        />
        <AssetInputMolecule
          address={props?.underlying?.address}
          type="Out"
          value={expected.loading ? ' ' : expected.out.normalized}
          loading={+expected.loading}
        />
        <TxFeesAtom
          function="withdraw"
          out={props?.underlying?.address}
          in={props?.address}
          fee={expected.fee.raw}
          loading={+expected.loading}
          pool={pool}
        />
        <Web3Button
          style={{ marginTop: '1rem' }}
          size="large"
          variant="contained"
          onClick={requestWithdraw}
          disabled={button.disabled || pool?.loading}
        >
          {button.text}
        </Web3Button>
      </Stack>
    </ModalAtom>
  );
}
