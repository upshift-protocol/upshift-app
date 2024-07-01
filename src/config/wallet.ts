import { http, createConfig } from 'wagmi';
import { arbitrum } from 'wagmi/chains';
import { injected, walletConnect } from 'wagmi/connectors';

const wcProjectId = '10fa7eb32238070e7838c931d185363a';
export const walletConfig = createConfig({
  chains: [arbitrum],
  connectors: [injected(), walletConnect({ projectId: wcProjectId })],
  transports: {
    [arbitrum.id]: http(),
  },
});
