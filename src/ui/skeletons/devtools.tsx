import { queryClient } from '@/config/react-query';
import { Button } from '@mui/material';
import Box from '@mui/material/Box';
import dynamic from 'next/dynamic';
import React, { Fragment, useState } from 'react';

const ReactQueryDevtoolsProduction = dynamic(() =>
  // eslint-disable-next-line import/extensions
  import('@tanstack/react-query-devtools/build/modern/production.js').then(
    (d) => ({
      default: d.ReactQueryDevtoolsPanel,
    }),
  ),
);

export default function DevtoolsSkeleton() {
  const [showQueryTools, setShowQueryTools] = useState(false);
  if (!process.env.NEXT_PUBLIC_DEV) return null;
  return (
    <Fragment>
      <Box position="fixed" bottom="1rem" right="1rem" zIndex={999}>
        <Button
          onClick={(e) => {
            e.stopPropagation();
            setShowQueryTools(!showQueryTools);
          }}
          variant="contained"
          color="warning"
          size="small"
        >
          {`${showQueryTools ? 'Close' : 'Open'} DevTools`}
        </Button>
      </Box>

      {showQueryTools && (
        <Box position="fixed" bottom="0" right="0" zIndex={99}>
          <ReactQueryDevtoolsProduction client={queryClient} />
        </Box>
      )}
    </Fragment>
  );
}
