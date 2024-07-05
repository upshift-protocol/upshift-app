import type { IAssetDisplay } from '@/utils/types';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Image from 'next/image';
import LinkAtom from './link';

export default function AssetDisplay(props: IAssetDisplay) {
  return (
    <LinkAtom
      underline="none"
      href={props?.address}
      style={{ color: 'inherit' }}
    >
      <Box
        style={{
          padding: '0.35rem 0.7rem',
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
    </LinkAtom>
  );
}
