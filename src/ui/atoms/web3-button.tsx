import type { ButtonProps } from '@mui/material';
import { Button, CircularProgress } from '@mui/material';
import { useAccount, useChainId, useChains, useSwitchChain } from 'wagmi';
import { FALLBACK_CHAINID } from '@/utils/constants/web3';
import { Fragment, useEffect, useState } from 'react';
import { useReferralsStore } from '@/stores/referrals';
import ConnectWalletMolecule from '../molecules/connect-wallet';

interface IWeb3Button extends ButtonProps {
  chainid?: number;
  loading?: number;
}

type IButtonState =
  | 'loading'
  | 'connect'
  | 'incorrect-network'
  | 'switch-network'
  | 'default';

export default function Web3Button(props: IWeb3Button) {
  const { address } = useAccount();
  const underlyingChainId = useChainId();
  const chains = useChains();
  const { switchChain } = useSwitchChain();
  const { modalOpen } = useReferralsStore();

  const [buttonState, setButtonState] = useState<IButtonState>('loading');

  const chainId = props?.chainid || underlyingChainId;

  useEffect(() => {
    if (!address) setButtonState('connect');
    else if (!chains.map((c) => c.id).includes(chainId))
      setButtonState('switch-network');
    else if (props?.chainid !== underlyingChainId)
      setButtonState('incorrect-network');
    else setButtonState('default');
  }, [address, chains?.length, chainId, underlyingChainId, props?.chainid]);

  switch (buttonState) {
    case 'loading': {
      return (
        <Button {...props} disabled={true} variant="contained">
          Loading
        </Button>
      );
    }
    case 'connect': {
      return (
        <Fragment>
          <ConnectWalletMolecule
            btnFullWidth
            variant="contained"
            color="primary"
          />
        </Fragment>
      );
    }
    case 'switch-network': {
      return (
        <Button
          {...props}
          onClick={(e) => {
            e.preventDefault();
            switchChain({ chainId: FALLBACK_CHAINID });
          }}
          disabled={false}
          variant="contained"
        >
          Switch Network
        </Button>
      );
    }
    case 'incorrect-network': {
      const foundChain = chains?.find((c) => c.id === props?.chainid);
      return (
        <Button
          {...props}
          onClick={(e) => {
            e.preventDefault();
            switchChain({ chainId: props.chainid || FALLBACK_CHAINID });
          }}
          disabled={false}
          variant="contained"
        >
          {foundChain?.id ? `Switch to ${foundChain.name}` : 'Switch Network'}
        </Button>
      );
    }
    default: {
      return (
        <Button
          {...props}
          variant="contained"
          startIcon={props?.loading ? <CircularProgress size={20} /> : null}
          disabled={(props as ButtonProps)?.disabled || modalOpen}
        >
          {modalOpen ? 'No cheating!' : props.children}
        </Button>
      );
    }
  }
}
