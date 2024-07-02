import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import ModalAtom from '../atoms/modal';

export default function DepositModalMolecule() {
  return (
    <ModalAtom
      title="Deposit"
      buttonProps={{
        children: 'Deposit',
        variant: 'outlined',
      }}
    >
      <Stack gap={2}>
        <TextField id="outlined-basic" label="Amount In" variant="outlined" />
        <TextField
          id="outlined-basic"
          label="Amount Out"
          disabled
          variant="outlined"
        />
        <Button size="large" variant="contained">
          Submit Transaction
        </Button>
      </Stack>
    </ModalAtom>
  );
}
