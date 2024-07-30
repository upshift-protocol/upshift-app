import { NETWORK } from '@/utils/constants/web3';
import { http, createConfig } from 'wagmi';
import { arbitrum, localhost } from 'wagmi/chains';
import { injected, walletConnect, coinbaseWallet } from 'wagmi/connectors';

const wcProjectId = '10fa7eb32238070e7838c931d185363a';

export const walletConfig = createConfig({
  chains: NETWORK === 'localhost' ? [localhost] : [arbitrum],
  connectors: [
    injected(),
    walletConnect({ projectId: wcProjectId }),
    coinbaseWallet({ appName: 'Lazarev' }),
  ],
  transports: {
    [arbitrum.id]: http(),
    [localhost.id]: http(),
  },
});
