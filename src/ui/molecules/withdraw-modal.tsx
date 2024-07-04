import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import ModalAtom from '../atoms/modal';

export default function WithdrawModalMolecule() {
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
        <TextField id="outlined-basic" label="Amount In" variant="outlined" />
        <TextField
          id="outlined-basic"
          label="Amount Out"
          variant="outlined"
          disabled
        />
        <Button style={{ marginTop: '1rem' }} size="large" variant="contained">
          Submit Transaction
        </Button>
      </Stack>
    </ModalAtom>
  );
}
