import type { IChainId } from '@augustdigital/sdk';
import { explorerLink, truncate } from '@augustdigital/sdk';
import { Typography } from '@mui/material';
import FONTS from '@/config/fonts';
import { FALLBACK_CHAINID } from '@/utils/constants/web3';
import LinkAtom from './anchor-link';

type IToast = {
  type?: 'tx';
  hash?: `0x${string}`;
  msg: string;
  chain?: IChainId;
};

export default function Toast({ hash, msg, chain = FALLBACK_CHAINID }: IToast) {
  if (hash) {
    return (
      <Typography fontFamily={FONTS.visiaPro.style.fontFamily}>
        {msg}{' '}
        <LinkAtom href={explorerLink(hash, chain, 'tx')}>
          {truncate(hash)}
        </LinkAtom>
      </Typography>
    );
  }
  return <Typography>{msg}</Typography>;
}
