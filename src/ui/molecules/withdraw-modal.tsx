import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import type { IPool } from '@augustdigital/types';
import ModalAtom from '../atoms/modal';
import AssetInputMolecule from './asset-input';

export default function WithdrawModalMolecule(props?: IPool) {
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
        <AssetInputMolecule symbol={props?.symbol} type="In" />
        <AssetInputMolecule symbol={'USDC'} type="Out" />
        <Button style={{ marginTop: '1rem' }} size="large" variant="contained">
          Submit Transaction
        </Button>
      </Stack>
    </ModalAtom>
  );
}
