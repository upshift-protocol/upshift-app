import Stack from '@mui/material/Stack';
import type { IPoolWithUnderlying } from '@augustdigital/sdk';
import ModalAtom from '../atoms/modal';
import AssetInputMolecule from './asset-input';
import Web3Button from '../atoms/web3-button';
import TxFeesAtom from '../atoms/tx-fees';

export default function WithdrawModalMolecule(props?: IPoolWithUnderlying) {
  return (
    <ModalAtom
      title="Withdraw"
      buttonProps={{
        children: 'Withdraw',
        variant: 'outlined',
        color: 'error',
      }}
    >
      <Stack spacing={2} position="relative">
        <AssetInputMolecule address={props?.address} type="In" />
        <AssetInputMolecule address={props?.underlying?.address} type="Out" />
        <TxFeesAtom
          function="withdraw"
          out={props?.underlying?.address}
          in={props?.address}
        />
        <Web3Button
          style={{ marginTop: '1rem' }}
          size="large"
          variant="contained"
        >
          Submit Transaction
        </Web3Button>
      </Stack>
    </ModalAtom>
  );
}
