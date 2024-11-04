import { ALCHEMY_API_KEY, NETWORK } from '@/utils/constants/web3';
import { http, createConfig } from 'wagmi';
import { localhost, avalanche } from 'wagmi/chains';
import { injected, walletConnect, coinbaseWallet } from 'wagmi/connectors';

const wcProjectId = '10fa7eb32238070e7838c931d185363a';

export const walletConfig = createConfig({
  chains: NETWORK === 'localhost' ? [avalanche, localhost] : [avalanche],
  connectors: [
    injected(),
    walletConnect({ projectId: wcProjectId }),
    coinbaseWallet({ appName: 'Upshift' }),
  ],
  transports: {
    [avalanche.id]: http(
      `https://avax-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
    ),
    [localhost.id]: http(),
  },
});
