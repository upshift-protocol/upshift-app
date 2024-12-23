import { useThemeMode } from '@/stores/theme';
import type { IAssetDisplay } from '@/utils/types';
import Stack from '@mui/material/Stack';
import { erc20Abi, zeroAddress } from 'viem';
import { useReadContract } from 'wagmi';
import AssetDisplay from '../molecules/asset-display';

type IAssetSelector = IAssetDisplay & {
  forInput?: boolean;
};

export default function AssetSelectorAtom(props: IAssetSelector) {
  const { isDark } = useThemeMode();

  const {
    data: symbol,
    isLoading,
    isPending,
  } = useReadContract({
    query: {
      enabled: props.address !== zeroAddress,
    },
    address: props.address,
    abi: erc20Abi,
    functionName: 'symbol',
    chainId: props?.chainId,
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
        symbol={props.symbol ?? symbol}
        truncate
        imgFallback
        chainId={props?.chainId}
        loading={isLoading && !isPending}
      />
    </Stack>
  );
}
