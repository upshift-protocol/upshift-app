import type { ButtonProps } from '@mui/material';
import { Button } from '@mui/material';
import { useAccount } from 'wagmi';
import { useState } from 'react';
import ConnectWalletMolecule from '../molecules/connect-wallet';

interface IWeb3Button extends ButtonProps {}

export default function Web3Button(props: IWeb3Button) {
  const { address } = useAccount();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  if (!address) {
    return (
      <div>
        <Button onClick={handleOpenModal}>Open Connect Wallet Modal</Button>
        {isModalOpen && (
          <ConnectWalletMolecule
            btnFullWidth
            variant="contained"
            color="primary"
            onClose={handleCloseModal}
          />
        )}
      </div>
    );
  }

  return (
    <Button {...props} variant="contained">
      {props.children}
    </Button>
  );
}
