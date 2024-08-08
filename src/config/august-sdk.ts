import { INFURA_API_KEY } from '@/utils/constants/web3';
import AugustDigitalSDK from '@augustdigital/sdk';

export const augustSdk = new AugustDigitalSDK({
  augustKey: process.env.NEXT_PUBLIC_AUGUST_DIGITAL_API_KEY as string,
  providers: {
    1: `https://mainnet.infura.io/v3/${INFURA_API_KEY}`,
    42161: `https://arbitrum-mainnet.infura.io/v3/${INFURA_API_KEY}`,
  },
});
