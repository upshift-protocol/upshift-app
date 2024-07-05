import type { IAssetDisplay } from '@/utils/types';
import { Box, Typography } from '@mui/material';
import Stack from '@mui/material/Stack';
import Image from 'next/image';

type IAssetSelector = IAssetDisplay & {
  forInput?: boolean;
};

export default function AssetSelectorAtom(props: IAssetSelector) {
  return (
    <Stack
      direction={'row'}
      alignItems={'center'}
      spacing={1}
      padding={'0 0.5rem'}
      style={{
        backgroundColor: 'theme.primary',
        borderRadius: '4px',
        borderTopLeftRadius: props.forInput ? '0px' : undefined,
        borderBottomLeftRadius: props.forInput ? '0px' : undefined,
      }}
    >
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
  );
}
