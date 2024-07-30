import { useThemeMode } from '@/stores/theme';
import { FALLBACK_TOKEN_IMG } from '@/utils/constants/web3';
import { STYLE_VARS } from '@/utils/constants/ui';
import type { IAssetDisplay } from '@/utils/types';
import { Box, Typography } from '@mui/material';
import Stack from '@mui/material/Stack';
import Image from 'next/image';
import { erc20Abi } from 'viem';
import { useReadContract } from 'wagmi';

type IAssetSelector = IAssetDisplay & {
  forInput?: boolean;
};

export default function AssetSelectorAtom(props: IAssetSelector) {
  const { isDark } = useThemeMode();

  const { data } = useReadContract({
    address: props.address,
    abi: erc20Abi,
    functionName: 'symbol',
  });

  return (
    <Stack
      direction={'row'}
      alignItems={'center'}
      spacing={1}
      padding={'0 0.5rem'}
      style={{
        backgroundColor: isDark ? 'rgba(255,255,255,0.23)' : 'rgba(0,0,0,0.23)',
        borderTopLeftRadius: props.forInput ? '0px' : undefined,
        borderBottomLeftRadius: props.forInput ? '0px' : undefined,
        borderTopRightRadius: props.forInput ? '4px' : undefined,
        borderBottomRightRadius: props.forInput ? '4px' : undefined,
      }}
    >
      <Image
        src={
          props?.img ??
          `/assets/${data?.toLowerCase()}.svg` ??
          FALLBACK_TOKEN_IMG
        }
        alt={props?.symbol ?? 'etherscan generic token'}
        height={24}
        width={24}
        style={{ borderRadius: '50%' }}
      />
      <Box width={STYLE_VARS.assetDivWidth}>
        <Typography variant="body1" noWrap>
          {props.symbol ?? data ?? 'N/A'}
        </Typography>
      </Box>
    </Stack>
  );
}
