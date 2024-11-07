import Tooltip from '@mui/material/Tooltip';
import type { ReactElement } from 'react';
import React from 'react';

interface ICopyToClipboard {
  children: ReactElement<any, any>;
  open: boolean;
  offset?: number;
}

export default function CopyToClipboard({
  children,
  open,
  offset = -12,
}: ICopyToClipboard) {
  return (
    <Tooltip
      title="Copied!"
      open={open}
      arrow
      placement="top"
      slotProps={{
        popper: {
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: [0, offset],
              },
            },
          ],
        },
      }}
    >
      {children}
    </Tooltip>
  );
}
