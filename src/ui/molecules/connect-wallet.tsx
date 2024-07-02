'use client';

import type { Connector } from 'wagmi';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Button from '@mui/material/Button';
import Image from 'next/image';
import type { SyntheticEvent } from 'react';
import { truncate } from '@/utils/helpers';
import React from 'react';
import Modal from '../atoms/modal';

const ConnectWalletMolecule = () => {
  const { connectors, connectAsync, isPending: connectPending } = useConnect();
  const { disconnect, isPending: disconnectPending } = useDisconnect();
  const { address } = useAccount();

  // wait for hydration, show loading state
  const [hydrated, setHydrated] = React.useState(false);
  React.useEffect(() => {
    setHydrated(true);
  }, []);
  if (!hydrated) return <Button variant="outlined">Connect Wallet</Button>;

  // remaining of functional component
  async function handleConnect(e: SyntheticEvent, id: string) {
    e.preventDefault();
    const foundConnector = connectors.find((c) => c.id === id);
    if (foundConnector) {
      try {
        await connectAsync({ connector: foundConnector });
      } catch (error) {
        console.error('user rejected request:', error);
      }
    }
  }

  function renderIcon(connector: Connector) {
    if (connector.icon) return connector.icon;
    return `/wallets/${connector.id?.toLowerCase()}.svg`;
  }

  function renderChildren() {
    if (address) return truncate(address);
    return 'Connect Wallet';
  }

  return (
    <Modal
      title="Connect Wallet"
      buttonProps={{
        variant: address ? 'contained' : 'outlined',
        color: address ? 'primary' : 'inherit',
        size: 'large',
        children: renderChildren(),
        onClick: address ? () => disconnect() : undefined,
      }}
      closeWhen={!!address}
    >
      <List>
        {connectors
          .filter((c) => c.id !== 'injected')
          .map((connector) => (
            <ListItem key={`connector-${connector.uid}`}>
              <Button
                onClick={(e) => handleConnect(e, connector.id)}
                disabled={connectPending || disconnectPending}
                fullWidth
                size="large"
                style={{ justifyContent: 'start' }}
                startIcon={
                  <Image
                    src={renderIcon(connector)}
                    height={32}
                    width={32}
                    alt={connector.name}
                  />
                }
              >
                {connector.name}
              </Button>
            </ListItem>
          ))}
      </List>
    </Modal>
  );
};

export default ConnectWalletMolecule;
