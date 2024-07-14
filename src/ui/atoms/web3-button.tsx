import type { ButtonProps } from '@mui/material';
import { Button } from '@mui/material';
import { useAccount } from 'wagmi';
import ConnectWalletMolecule from '../molecules/connect-wallet';

interface IWeb3Button extends ButtonProps {}

export default function Web3Button(props: IWeb3Button) {
  const { address } = useAccount();

  if (!address) {
    return (
      <ConnectWalletMolecule btnFullWidth variant="contained" color="primary" />
    );
  }

  return (
    <Button {...props} variant="contained">
      {props.children}
    </Button>
  );
}
