import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { useReferralsStore } from '@/stores/referrals';
import Typography from '@mui/material/Typography';
import Collapse from '@mui/material/Collapse';
import ModalAtom from '../atoms/modal';

export default function ReferralsModalMolecule() {
  const {
    codeInput,
    onInputChange,
    modalOpen,
    codeInputId,
    verifyCode,
    isVerifying,
    message,
  } = useReferralsStore();
  const isSuccess = message?.includes('success');
  return (
    <ModalAtom
      title="Referrals"
      description="Upshift requires users to be referred by another user. If you do not have a referral code, please reach out to the Upshift team via Telegram."
      closeWhen={!modalOpen}
      isOpen={modalOpen}
      disableClose={!isSuccess}
    >
      <Stack gap={0}>
        <TextField
          variant="filled"
          label="Referral code"
          id={codeInputId}
          value={codeInput}
          onChange={onInputChange}
        />
        <Collapse in={!!message}>
          <Typography
            sx={{ paddingLeft: '4px' }}
            color={isSuccess ? 'primary' : 'error'}
            variant="caption"
          >
            {message}
          </Typography>
        </Collapse>
      </Stack>
      <Stack mt={3}>
        <Button
          size="large"
          variant="contained"
          onClick={verifyCode}
          disabled={isVerifying || !!message}
          startIcon={isVerifying ? <CircularProgress size={20} /> : null}
        >
          {isSuccess ? 'Code Confirmed' : 'Verify Code'}
        </Button>
      </Stack>
    </ModalAtom>
  );
}
