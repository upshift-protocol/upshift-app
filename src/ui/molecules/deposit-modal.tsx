import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import type { IPool } from '@augustdigital/types';
import ModalAtom from '../atoms/modal';
import AssetInputMolecule from './asset-input';

export default function DepositModalMolecule(props?: IPool) {
  return (
    <ModalAtom
      title="Deposit"
      buttonProps={{
        children: 'Deposit',
        variant: 'outlined',
      }}
    >
      <Stack gap={2}>
        <AssetInputMolecule symbol={'USDC'} type="In" />
        <AssetInputMolecule symbol={props?.symbol} type="Out" />
        <Button size="large" variant="contained">
          Submit Transaction
        </Button>
      </Stack>
    </ModalAtom>
  );
}
