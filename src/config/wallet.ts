import { NETWORK, RPC_URLS } from '@/utils/constants/web3';
import { http, createConfig } from 'wagmi';
import { localhost, avalanche, mainnet } from 'wagmi/chains';
import { injected, walletConnect, coinbaseWallet } from 'wagmi/connectors';

const wcProjectId = '10fa7eb32238070e7838c931d185363a';

export const walletConfig = createConfig({
  chains:
    NETWORK === 'localhost'
      ? [mainnet, avalanche, localhost]
      : [mainnet, avalanche],
  connectors: [
    injected(),
    walletConnect({ projectId: wcProjectId }),
    coinbaseWallet({ appName: 'Upshift' }),
  ],
  transports: {
    [mainnet.id]: http(RPC_URLS[1]),
    [avalanche.id]: http(RPC_URLS[43114]),
    [localhost.id]: http(),
  },
});
