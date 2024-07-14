import type { ButtonProps } from '@mui/material';
import { Button } from '@mui/material';
import { useAccount } from 'wagmi';

interface IWeb3Button extends ButtonProps {}

export default function Web3Button(props: IWeb3Button) {
  const { address } = useAccount();

  function renderOnClick(e: React.MouseEvent<HTMLButtonElement>) {
    if (!address) {
      // TODO handle click when no address connected
    }
    return props.onClick?.(e);
  }

  function renderChildren() {
    if (!address) return 'Connect Wallet';
    return props.children;
  }

  return (
    <Button {...props} onClick={renderOnClick} variant="contained">
      {renderChildren()}
    </Button>
  );
}
