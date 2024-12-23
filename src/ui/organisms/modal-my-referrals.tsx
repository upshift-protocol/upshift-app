import Stack from '@mui/material/Stack';
import { useReferralsStore } from '@/stores/referrals';
import {
  Divider,
  IconButton,
  Paper,
  Typography,
  useTheme,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { Fragment, useEffect, useMemo, useState } from 'react';
import type { ButtonProps } from '@mui/material/Button';
import ModalAtom from '../atoms/modal';
import CopyToClipboard from '../atoms/copy-to-clipboard';

// interfaces
interface IMyReferralsModalMolecule {
  buttonProps?: ButtonProps;
}

// helpers
const TIMEOUT_DELAY = 1000; // 1 second

// main functional component
export default function MyReferralsModalMolecule({
  buttonProps,
}: IMyReferralsModalMolecule) {
  const { palette } = useTheme();
  const { referrals } = useReferralsStore();

  const [copiedCode, setCopiedCode] = useState('');
  function copyToClipboard(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    code: string,
  ) {
    e.preventDefault();
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
  }

  useEffect(() => {
    if (copiedCode) {
      const timeout = setTimeout(() => setCopiedCode(''), TIMEOUT_DELAY);
      return () => clearTimeout(timeout);
    }
    return () => {};
  }, [copiedCode]);

  const sortedReferrals = useMemo(() => {
    return referrals.sort((sRef) => (sRef.used ? 1 : -1));
  }, [referrals.length]);

  return (
    <ModalAtom
      title="My Referral Codes"
      description="Share any of these unused codes with anyone that wants to use the Upshift Protocol."
      buttonProps={{
        ...buttonProps,
        children: 'My Referrals',
        variant: buttonProps?.variant || 'text',
        color: buttonProps?.color || 'info',
        disabled: buttonProps?.disabled || !referrals?.length,
        style: {
          fontSize: '18px',
        },
      }}
      headerStyle={{ marginBottom: '0.5rem' }}
    >
      <Paper
        variant="outlined"
        sx={{ maxHeight: '30rem', overflowY: 'scroll' }}
      >
        <Stack gap={0} px={2} py={0.5}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography variant="overline" color="gray" sx={{ lineHeight: 2 }}>
              Code
            </Typography>
            <Typography variant="overline" color="gray" sx={{ lineHeight: 2 }}>
              Available
            </Typography>
          </Stack>
          {sortedReferrals.map((ref, i) => (
            <Fragment key={`my-referral-${i}`}>
              {i === 0 ? null : <Divider />}
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                py={1}
              >
                <Stack direction="row" alignItems="center" gap={1}>
                  <Typography minWidth="125px">{ref.code}</Typography>
                  <CopyToClipboard open={ref.code === copiedCode}>
                    <IconButton
                      color="primary"
                      sx={{ fontSize: '18px' }}
                      disabled={ref.used}
                      onClick={(
                        e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
                      ) => copyToClipboard(e, ref.code)}
                    >
                      <ContentCopyIcon fontSize="inherit" />
                    </IconButton>
                  </CopyToClipboard>
                </Stack>
                {ref.used ? (
                  <CancelIcon htmlColor={palette.error.main} fontSize="small" />
                ) : (
                  <CheckCircleIcon
                    htmlColor={palette.primary.main}
                    fontSize="small"
                  />
                )}
              </Stack>
            </Fragment>
          ))}
        </Stack>
      </Paper>
    </ModalAtom>
  );
}
