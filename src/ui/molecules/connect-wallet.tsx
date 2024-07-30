"use client";

import { useAccount, useConnect, useDisconnect } from "wagmi";
import { useSwitchChain } from "wagmi";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import CircularProgress from "@mui/material/CircularProgress";
import Image from "next/image";
import type { SyntheticEvent } from "react";
import { truncate } from "@/utils/helpers";
import React from "react";
import { Link, Typography } from "@mui/material";
import Modal from "../atoms/modal";
import { arbitrum } from "wagmi/chains";
import { useChainId } from "wagmi";

const TERMS_OF_SERVICE_URL =
  "https://docs.augustdigital.io/legal/legal-notices/terms-of-service";
const PRIVACY_POLICY_URL =
  "https://docs.augustdigital.io/legal/legal-notices/privacy-policy";

type IConnectWallet = {
  btnFullWidth?: boolean;
  variant?: "contained" | "text" | "outlined";
  color?: "primary" | "inherit";
  onClose?: (() => void) | undefined;
};

interface Connector {
  name: string;
  id: string;
}

const connectorsList: Connector[] = [
  {
    name: "Metamask",
    id: "io.metamask",
  },
  {
    name: "Wallet Connect",
    id: "walletConnect",
  },
  {
    name: "Ledger",
    id: "ledger",
  },
  {
    name: "Coinbase Wallet",
    id: "coinbaseWalletSDK",
  },
];

const ConnectWalletMolecule = ({
  btnFullWidth,
  variant,
  color,
  onClose,
}: IConnectWallet) => {
  const { connectors, connectAsync, isPending: connectPending } = useConnect();
  const { disconnect, isPending: disconnectPending } = useDisconnect();
  const { address } = useAccount();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();

  const [selectedConnector, setSelectedConnector] =
    React.useState<Connector | null>(null);
  const [agreeToTerms, setAgreeToTerms] = React.useState(false);

  // wait for hydration, show loading state
  const [hydrated, setHydrated] = React.useState(false);
  React.useEffect(() => {
    setHydrated(true);
  }, []);
  if (!hydrated) return <Button variant="outlined">Connect Wallet</Button>;

  async function handleConnect(e: SyntheticEvent) {
    e.preventDefault();
    if (selectedConnector) {
      const selectedWallet = connectors.find(
        ({ id }) => id === selectedConnector?.id
      );
      try {
        if (selectedWallet) {
          await connectAsync({
            connector: selectedWallet,
          });
          if (onClose) {
            onClose();
          }
          if (chainId !== arbitrum.id) {
            await switchChain({ chainId: arbitrum.id });
          }
        }
      } catch (error) {
        console.error("user rejected request:", error);
      }
    }
  }

  function renderIcon(connector: Connector) {
    return `/wallets/${connector.id?.toLowerCase()}.svg`;
  }

  function renderChildren() {
    if (address) return truncate(address);
    return "Connect Wallet";
  }

  return (
    <Modal
      title="Connect Wallet"
      buttonProps={{
        fullWidth: btnFullWidth ?? false,
        variant: variant ?? (address ? "contained" : "outlined"),
        color: color ?? (address ? "primary" : "inherit"),
        size: "large",
        children: renderChildren(),
        onClick: address ? () => disconnect() : undefined,
      }}
      closeWhen={!!address}
    >
      <List>
        {connectorsList
          .filter((c) => c.id !== "injected")
          .map((connector, index) => (
            <ListItem key={`connector-${index}`}>
              <Button
                onClick={() => setSelectedConnector(connector)}
                disabled={connectPending || disconnectPending}
                fullWidth
                size="medium"
                variant={
                  selectedConnector?.id === connector.id
                    ? "contained"
                    : "outlined"
                }
                style={{
                  justifyContent: "start",
                  ...(selectedConnector?.id !== connector.id
                    ? {
                        "&:hover": {
                          backgroundColor: "#e0e0e0",
                        },
                      }
                    : {}),
                }}
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
        <ListItem>
          <FormControlLabel
            control={
              <Checkbox
                checked={agreeToTerms}
                onChange={(e) => setAgreeToTerms(e.target.checked)}
                name="agreeToTerms"
                color="primary"
              />
            }
            label={
              <Typography fontSize={"0.875rem"}>
                I have read and accept{" "}
                <Link target="_blank" href={TERMS_OF_SERVICE_URL}>
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link target="_blank" href={PRIVACY_POLICY_URL}>
                  Privacy Notice
                </Link>
              </Typography>
            }
          />
        </ListItem>
        <ListItem>
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
            startIcon={connectPending ? <CircularProgress size={24} /> : null}
          >
            {connectPending ? "Connecting..." : "Connect"}
          </Button>
        </ListItem>
      </List>
    </Modal>
  );
};

export default ConnectWalletMolecule;
