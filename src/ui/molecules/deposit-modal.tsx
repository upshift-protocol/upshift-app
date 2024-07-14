import Stack from '@mui/material/Stack';
import type { IPoolWithUnderlying } from '@augustdigital/sdk';
import ModalAtom from '../atoms/modal';
import AssetInputMolecule from './asset-input';
import Web3Button from '../atoms/web3-button';
import TxFeesAtom from '../atoms/tx-fees';

export default function DepositModalMolecule(
  props: IPoolWithUnderlying | undefined,
) {
  return (
    <ModalAtom
      title="Deposit"
      buttonProps={{
        children: 'Deposit',
        variant: 'outlined',
      }}
    >
      <Stack gap={2}>
        <AssetInputMolecule address={props?.underlying?.address} type="In" />
        <AssetInputMolecule address={props?.address} type="Out" />
        <TxFeesAtom
          function="deposit"
          in={props?.underlying?.address}
          out={props?.address}
        />
        <Web3Button size="large" variant="contained">
          Submit Transaction
        </Web3Button>
      </Stack>
    </ModalAtom>
  );
}
