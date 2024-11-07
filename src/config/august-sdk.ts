import { RPC_URLS } from '@/utils/constants/web3';
import AugustDigitalSDK from '@augustdigital/sdk';

export const augustSdk = new AugustDigitalSDK({
  augustKey: process.env.NEXT_PUBLIC_AUGUST_DIGITAL_API_KEY as string,
  providers: {
    1: RPC_URLS[1],
    43114: RPC_URLS[43114],
  },
  env: process.env.NEXT_PUBLIC_DEV ? 'DEV' : 'PROD',
});
