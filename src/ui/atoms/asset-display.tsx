import type { IAssetDisplay } from '@/utils/types';
import { Box, Link, Stack, Typography } from '@mui/material';
import Image from 'next/image';

export default function AssetDisplay(props: IAssetDisplay) {
  return (
    <Link underline="none" color="theme.primary" href={props?.address}>
      <Box
        style={{
          padding: '0.4rem 0.75rem',
          width: 'fit-content',
          cursor: 'pointer',
        }}
        className="glass"
      >
        <Stack direction={'row'} alignItems={'center'} spacing={1.5}>
          <Image
            src={props?.img ?? '/assets/usdc.svg'}
            alt={props?.symbol ?? 'usdc'}
            height={24}
            width={24}
          />
          <Box>
            <Typography variant="h6">{props?.symbol ?? 'USDC'}</Typography>
          </Box>
        </Stack>
      </Box>
    </Link>
  );
}
