import { ACTIVE_NETWORKS, ACTIVE_TRANSPORTS } from '@/config/networks';
import { createConfig } from 'wagmi';
import { injected, walletConnect, coinbaseWallet } from 'wagmi/connectors';

const wcProjectId = '10fa7eb32238070e7838c931d185363a';

export const walletConfig = createConfig({
  chains: ACTIVE_NETWORKS() as any,
  connectors: [
    injected(),
    walletConnect({ projectId: wcProjectId }),
    coinbaseWallet({ appName: 'Upshift' }),
  ],
  transports: ACTIVE_TRANSPORTS,
});
