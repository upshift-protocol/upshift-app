import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import MuiModal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import type { ButtonProps } from '@mui/material/Button';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Close from '@mui/icons-material/Close';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  minWidth: 300,
  width: '95%',
  maxWidth: 500,
  boxShadow: 12,
};

export default function ModalAtom({
  buttonProps,
  children,
  title,
  closeWhen,
  description,
  onClose,
  isOpen,
  disableClose,
  headerStyle,
}: {
  title: string;
  buttonProps?: ButtonProps;
  children: React.ReactNode;
  closeWhen?: boolean;
  description?: string;
  onClose?: Function;
  isOpen?: boolean;
  disableClose?: boolean;
  headerStyle?: React.CSSProperties;
}) {
  const [open, setOpen] = React.useState(isOpen || false);
  const handleOpen = (e?: React.SyntheticEvent) => {
    e?.stopPropagation();
    setOpen(true);
  };
  const handleClose = (e?: React.SyntheticEvent) => {
    e?.stopPropagation();
    onClose?.();
    setOpen(false);
  };

  React.useEffect(() => {
    if (typeof isOpen !== 'undefined') {
      setOpen(isOpen);
    }
  }, [isOpen]);

  React.useEffect(() => {
    if (typeof closeWhen !== 'undefined') {
      if (closeWhen) handleClose();
    }
  }, [closeWhen]);

  return (
    <Box
      onClick={(e) => e.stopPropagation()}
      sx={{ width: buttonProps?.fullWidth ? '100%' : 'auto' }}
    >
      {buttonProps ? (
        <Button
          {...buttonProps}
          sx={{
            width: buttonProps?.fullWidth ? '100%' : 'auto',
            whiteSpace: 'nowrap',
          }}
          onClick={buttonProps?.onClick ?? handleOpen}
        >
          {buttonProps.children}
        </Button>
      ) : null}
      <MuiModal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={disableClose ? undefined : (handleClose as () => void)}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
        sx={{ zIndex: 88 }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <Card style={{ padding: '1rem' }}>
              <Stack
                direction="row"
                justifyContent="space-between"
                width="100%"
              >
                <Stack mb={3} style={headerStyle}>
                  <Typography variant="h5">{title}</Typography>
                  {description ? (
                    <Typography variant="caption">{description}</Typography>
                  ) : null}
                </Stack>
                {disableClose ? null : (
                  <Button
                    variant="text"
                    onClick={handleClose}
                    style={{
                      borderRadius: '50%',
                      padding: '6px',
                      width: '32px',
                      height: '32px',
                      minWidth: '32px',
                      minHeight: '32px',
                    }}
                  >
                    <Close />
                  </Button>
                )}
              </Stack>
              {children}
            </Card>
          </Box>
        </Fade>
      </MuiModal>
    </Box>
  );
}
