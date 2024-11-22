import { ACTIVE_NETWORKS, RPC_URLS } from '@/utils/constants/web3';
import { http, createConfig } from 'wagmi';
import { localhost, avalanche, mainnet, base } from 'wagmi/chains';
import { injected, walletConnect, coinbaseWallet } from 'wagmi/connectors';

const wcProjectId = '10fa7eb32238070e7838c931d185363a';

export const walletConfig = createConfig({
  chains: ACTIVE_NETWORKS as any,
  connectors: [
    injected(),
    walletConnect({ projectId: wcProjectId }),
    coinbaseWallet({ appName: 'Upshift' }),
  ],
  transports: {
    [mainnet.id]: http(RPC_URLS[1]),
    [avalanche.id]: http(RPC_URLS[43114]),
    [base.id]: http(RPC_URLS[8453]),
    [localhost.id]: http(),
  },
});
