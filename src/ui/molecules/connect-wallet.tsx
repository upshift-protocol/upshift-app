'use client';

import type { Connector } from 'wagmi';
import {
  useAccount,
  useConnect,
  useDisconnect,
  useSwitchChain,
  useChainId,
} from 'wagmi';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import CircularProgress from '@mui/material/CircularProgress';
import Image from 'next/image';
import type { SyntheticEvent } from 'react';
import { truncate } from '@/utils/helpers/string';
import React from 'react';
import { Chip, Link, Stack, Typography, useMediaQuery } from '@mui/material';
import { mainnet } from 'wagmi/chains';
import { LINKS } from '@/utils/constants/links';
import { useThemeMode } from '@/stores/theme';
import { FALLBACK_CHAINID } from '@/utils/constants/web3';
import Modal from '../atoms/modal';

type IConnectWallet = {
  btnFullWidth?: boolean;
  variant?: 'contained' | 'text' | 'outlined';
  color?: 'primary' | 'inherit';
  onClose?: (() => void) | undefined;
};

const connectorsList: Partial<Connector>[] = [
  {
    name: 'Metamask',
    id: 'io.metamask',
  },
  {
    name: 'Wallet Connect',
    id: 'walletConnect',
  },
  {
    name: 'Coinbase Wallet',
    id: 'coinbaseWalletSDK',
  },
];

const ConnectWalletMolecule = ({
  btnFullWidth,
  variant,
  color,
  onClose,
}: IConnectWallet) => {
  const { isDark } = useThemeMode();
  const { connectors, connectAsync, isPending: connectPending } = useConnect();
  const { disconnect, isPending: disconnectPending } = useDisconnect();
  const { address } = useAccount();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const isLarge = useMediaQuery('(min-width: 768px)');

  const [selectedConnector, setSelectedConnector] =
    React.useState<Partial<Connector> | null>(null);
  const [agreeToTerms, setAgreeToTerms] = React.useState(false);

  // wait for hydration, show loading state
  const [hydrated, setHydrated] = React.useState(false);
  React.useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated)
    return (
      <Button variant="outlined">
        {isLarge ? 'Connect Wallet' : 'Connect'}
      </Button>
    );

  async function handleConnect(e: SyntheticEvent) {
    e.preventDefault();
    if (selectedConnector) {
      const selectedWallet = connectors.find(
        ({ id }) => id === selectedConnector?.id,
      );
      try {
        if (selectedWallet) {
          await connectAsync({
            connector: selectedWallet,
          });
          if (onClose) {
            onClose();
          }
        }
      } catch (error) {
        console.error('#handleConnect:', error);
      } finally {
        if (chainId !== mainnet.id) {
          switchChain({ chainId: mainnet.id });
        }
        setSelectedConnector(null);
      }
    }
  }

  function renderIcon(connector: Partial<Connector>) {
    if (!connector.id || connector.id === '-')
      return `/wallets/${FALLBACK_CHAINID}.svg`;
    if (connector?.icon) return connector?.icon;
    return `/wallets/${connector.id?.toLowerCase()}.svg`;
  }

  function renderChildren() {
    if (address) return truncate(address);
    return 'Connect Wallet';
  }

  return (
    <Modal
      title="Connect Wallet"
      description='Select an available wallet provider or "Wallet Connect" to see more options.'
      buttonProps={{
        fullWidth: !!btnFullWidth,
        variant: variant ?? (address ? 'contained' : 'outlined'),
        color: color ?? (address ? 'primary' : 'inherit'),
        size: 'large',
        children: renderChildren(),
        onClick: address ? () => disconnect() : undefined,
      }}
      closeWhen={!!address}
    >
      <List>
        {/* Default connectors */}
        {connectorsList
          .filter((c) => c.id !== 'injected')
          .map((connector, index) => (
            <ListItem key={`connector-${index}`} sx={{ px: '0px' }}>
              <Button
                onClick={() => setSelectedConnector(connector)}
                disabled={connectPending || disconnectPending}
                fullWidth
                size="large"
                variant={'outlined'}
                style={{
                  justifyContent: 'start',
                }}
                startIcon={
                  <Image
                    src={renderIcon(connector)}
                    height={28}
                    width={28}
                    alt={connector.name || connector.id || 'wallet connector'}
                  />
                }
              >
                <Stack
                  direction="row"
                  justifyContent={'space-between'}
                  width="100%"
                >
                  <Typography
                    variant="button"
                    color={
                      selectedConnector?.id === connector?.id
                        ? 'primary'
                        : isDark
                          ? 'white'
                          : '#212121'
                    }
                  >
                    {connector.name}
                  </Typography>
                  {selectedConnector?.id === connector?.id ? (
                    <Chip
                      label="Selected"
                      variant="outlined"
                      color="primary"
                      size="small"
                      style={{ fontSize: '12px', justifySelf: 'flex-end' }}
                    />
                  ) : null}
                </Stack>
              </Button>
            </ListItem>
          ))}
      </List>

      <FormControlLabel
        sx={{ my: 1, pl: 1 }}
        control={
          <Checkbox
            checked={agreeToTerms}
            onChange={(e) => setAgreeToTerms(e.target.checked)}
            name="agreeToTerms"
            color="primary"
          />
        }
        label={
          <Typography variant="body2">
            I have read and accept{' '}
            <Link target="_blank" href={LINKS.terms_of_service}>
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link target="_blank" href={LINKS.privacy_policy}>
              Privacy Notice
            </Link>
          </Typography>
        }
      />

      <Button
        onClick={handleConnect}
        disabled={
          !selectedConnector ||
          !agreeToTerms ||
          connectPending ||
          disconnectPending
        }
        fullWidth
        size="large"
        variant="contained"
        color="primary"
        sx={{ mt: 1 }}
        startIcon={connectPending ? <CircularProgress size={20} /> : null}
      >
        {connectPending ? 'Connecting...' : 'Connect'}
      </Button>
    </Modal>
  );
};

export default ConnectWalletMolecule;
