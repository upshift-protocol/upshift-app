import { FALLBACK_TOKEN_IMG, STYLE_VARS } from '@/utils/constants/ui';
import type { IAssetDisplay } from '@/utils/types';
import type { TypographyVariant } from '@mui/material';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { IChainId } from '@augustdigital/sdk';
import { explorerLink } from '@augustdigital/sdk';
import { FALLBACK_CHAINID } from '@/utils/constants/web3';
import { useChainId } from 'wagmi';

export default function AssetDisplay(props: IAssetDisplay) {
  const [imgSrc, setImgSrc] = useState<string>(props?.img ?? '');
  const chainId = useChainId();

  function renderVariant(): {
    wrapperCss: string;
    textVariant: TypographyVariant;
    padding?: string;
  } {
    switch (props.variant) {
      case 'glass':
        return {
          wrapperCss: 'glass',
          textVariant: 'h6',
          padding: '0.35rem 0.7rem',
        };
      default:
        return { wrapperCss: '', textVariant: 'body1' };
    }
  }

  useEffect(() => {
    if (props.img) setImgSrc(props.img);
  }, [props.img]);

  function renderInner() {
    return (
      <Box
        style={{
          padding: renderVariant().padding,
          width: 'fit-content',
        }}
        className={renderVariant().wrapperCss}
      >
        <Stack direction={'row'} alignItems={'center'} spacing={1}>
          {props.img || props.imgFallback ? (
            <Image
              src={imgSrc}
              alt={props?.symbol ?? props?.address ?? ''}
              height={props?.imgSize ?? 24}
              width={props?.imgSize ?? 24}
              onError={() => setImgSrc(FALLBACK_TOKEN_IMG)}
            />
          ) : null}
          {props?.symbol ? (
            <Box width={props.truncate ? STYLE_VARS.assetDivWidth : undefined}>
              <Typography
                variant={renderVariant().textVariant}
                noWrap
                textOverflow="ellipsis"
              >
                {props?.symbol}
              </Typography>
            </Box>
          ) : null}
        </Stack>
      </Box>
    );
  }

  if (props.address) {
    return (
      <Link
        style={{ cursor: 'pointer', textDecoration: 'none', color: 'inherit' }}
        href={explorerLink(
          props.address,
          (chainId as IChainId) || FALLBACK_CHAINID,
          'token',
        )}
        target="_blank"
        rel="noreferrer"
      >
        {renderInner()}
      </Link>
    );
  }

  return renderInner();
}
