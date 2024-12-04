import { STYLE_VARS, FALLBACK_CHAINID } from '@/utils/constants';
import type { IAssetDisplay } from '@/utils/types';
import { Skeleton, Tooltip, type TypographyVariant } from '@mui/material';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import type { IChainId } from '@augustdigital/sdk';
import { explorerLink } from '@augustdigital/sdk';
import { useChainId } from 'wagmi';
import TokenLogo from '../atoms/token-logo';

export default function AssetDisplay(props: IAssetDisplay) {
  const chainId = useChainId();

  function renderVariant(): {
    wrapperCss: string;
    textVariant?: TypographyVariant;
    padding?: string;
    fontSize?: string;
  } {
    switch (props.variant) {
      case 'glass':
        return {
          wrapperCss: 'glass',
          fontSize: '1.25rem',
          padding: '0.35rem 0.7rem',
        };
      default:
        return { wrapperCss: '', textVariant: 'body1' };
    }
  }

  function renderInner() {
    return (
      <Box
        style={{
          padding: renderVariant().padding,
          width: 'fit-content',
          borderRadius: '4px',
        }}
        className={renderVariant().wrapperCss}
      >
        <Stack direction={'row'} alignItems={'center'} spacing={1}>
          {props.symbol && !props?.loading ? (
            <TokenLogo symbol={props.symbol || ''} size={props?.imgSize} />
          ) : props?.loading ? (
            <Skeleton
              variant="circular"
              height={props?.imgSize || 24}
              width={props?.imgSize || 24}
            />
          ) : null}
          {props?.symbol && !props?.loading ? (
            <Box width={props.truncate ? STYLE_VARS.assetDivWidth : undefined}>
              <Typography
                variant={renderVariant().textVariant}
                noWrap
                textOverflow="ellipsis"
              >
                {props?.symbol}
              </Typography>
            </Box>
          ) : props?.loading ? (
            <Box width={props.truncate ? STYLE_VARS.assetDivWidth : undefined}>
              <Skeleton variant="text" height="30px" width="42px" />
            </Box>
          ) : null}
        </Stack>
      </Box>
    );
  }

  if (props.tooltip && props.symbol) {
    return (
      <Tooltip
        title={props?.symbol}
        placement="top"
        arrow
        sx={{
          position: 'relative',
        }}
      >
        <TokenLogo symbol={props.symbol || ''} size={props?.imgSize} />
      </Tooltip>
    );
  }

  if (props.address) {
    return (
      <Link
        style={{ cursor: 'pointer', textDecoration: 'none', color: 'inherit' }}
        href={explorerLink(
          props.address,
          (props?.chainId as IChainId) ||
            (chainId as IChainId) ||
            FALLBACK_CHAINID,
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
