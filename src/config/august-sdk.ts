import { ALCHEMY_API_KEY } from '@/utils/constants/web3';
import AugustDigitalSDK from '@augustdigital/sdk';

export const augustSdk = new AugustDigitalSDK({
  augustKey: process.env.NEXT_PUBLIC_AUGUST_DIGITAL_API_KEY as string,
  providers: {
    43114: `https://avax-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
  },
  env: process.env.NEXT_PUBLIC_DEV ? 'DEV' : 'PROD',
});
