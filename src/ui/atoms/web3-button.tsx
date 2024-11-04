import type { ButtonProps } from '@mui/material';
import { Button, CircularProgress } from '@mui/material';
import { useAccount, useChainId, useChains, useSwitchChain } from 'wagmi';
import { FALLBACK_CHAINID } from '@/utils/constants/web3';
import ConnectWalletMolecule from '../molecules/connect-wallet';

interface IWeb3Button extends ButtonProps {
  chainId?: number;
  loading?: boolean;
}

export default function Web3Button(props: IWeb3Button) {
  const { address } = useAccount();
  const underlyingChainId = useChainId();
  const chains = useChains();
  const { switchChain } = useSwitchChain();
  const chainId = props?.chainId || underlyingChainId;

  if (!address) {
    return (
      <div>
        <ConnectWalletMolecule
          btnFullWidth
          variant="contained"
          color="primary"
        />
      </div>
    );
  }

  if (!chains.map((c) => c.id).includes(chainId)) {
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

  if (props?.chainId !== underlyingChainId) {
    const foundChain = chains?.find((c) => c.id === props?.chainId);
    return (
      <Button
        {...props}
        onClick={(e) => {
          e.preventDefault();
          switchChain({ chainId: props.chainId || FALLBACK_CHAINID });
        }}
        disabled={false}
        variant="contained"
      >
        {foundChain?.id ? `Switch to ${foundChain.name}` : 'Switch Network'}
      </Button>
    );
  }

  return (
    <Button
      {...props}
      variant="contained"
      startIcon={props?.loading ? <CircularProgress size={20} /> : null}
    >
      {props.children}
    </Button>
  );
}
