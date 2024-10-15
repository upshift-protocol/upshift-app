import { useThemeMode } from '@/stores/theme';
import type { ITheme } from '@/utils/types';
import { Stack, styled, Typography } from '@mui/material';
import { isAddress, zeroAddress } from 'viem';
import type { IChainId } from '@augustdigital/sdk';
import { explorerLink, truncate } from '@augustdigital/sdk';
import { FALLBACK_CHAINID } from '@/utils/constants/web3';
import { useChainId } from 'wagmi';
import LinkAtom from './anchor-link';

type IBoxedListItem = {
  label: string | JSX.Element | number;
  value: string | JSX.Element | number;
};

const StackOutline = styled(Stack)<{ thememode: ITheme }>`
  border-radius: 4px;
  padding: 0.5rem 1rem;
  gap: 6px;
  border: 1px solid
    ${({ thememode }) =>
      thememode === 'dark' ? 'rgba(255,255,255,0.23)' : 'rgba(0,0,0,0.23)'};
`;

const StackRow = styled(Stack)`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export default function BoxedListAtom(props: {
  items: IBoxedListItem[];
  chainId?: number;
}) {
  const { theme } = useThemeMode();
  const underlyingChainId = useChainId();
  const chainId = props?.chainId || underlyingChainId;

  return (
    <StackOutline thememode={theme}>
      {props.items.map((item, i) => (
        <StackRow key={`boxed-list-item-${i}`}>
          <Typography variant="body2">{item.label}</Typography>
          {typeof item.value === 'string' && isAddress(item.value) ? (
            <>
              {item.value === zeroAddress ? (
                <Typography variant="body2" fontFamily="monospace">
                  {'ETH'}
                </Typography>
              ) : (
                <LinkAtom
                  href={explorerLink(
                    item.value,
                    (chainId as IChainId) || FALLBACK_CHAINID,
                    'token',
                  )}
                >
                  {item.value === zeroAddress ? 'ETH' : truncate(item.value)}
                </LinkAtom>
              )}
            </>
          ) : (
            <Typography variant="body2" fontFamily="monospace">
              {item.value}
            </Typography>
          )}
        </StackRow>
      ))}
    </StackOutline>
  );
}
