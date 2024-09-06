import { useThemeMode } from '@/stores/theme';
import type { IAssetDisplay } from '@/utils/types';
import Stack from '@mui/material/Stack';
import { erc20Abi } from 'viem';
import { useReadContract } from 'wagmi';
import AssetDisplay from './asset-display';

type IAssetSelector = IAssetDisplay & {
  forInput?: boolean;
};

export default function AssetSelectorAtom(props: IAssetSelector) {
  const { isDark } = useThemeMode();

  const { data: symbol } = useReadContract({
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
      <AssetDisplay
        address={props.address}
        img={props.img || `/assets/tokens/${props.symbol ?? symbol}.png`}
        symbol={props.symbol ?? symbol}
        truncate
        imgFallback
        chainId={props?.chainId}
      />
    </Stack>
  );
}
