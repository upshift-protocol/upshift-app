import { ALCHEMY_API_KEY } from '@/utils/constants/web3';
import AugustDigitalSDK from '@augustdigital/sdk';

export const augustSdk = new AugustDigitalSDK({
  augustKey: process.env.NEXT_PUBLIC_AUGUST_DIGITAL_API_KEY as string,
  providers: {
    1: `https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
    42161: `https://arb-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
  },
  env: process.env.NEXT_PUBLIC_DEV ? 'DEV' : 'PROD',
});
