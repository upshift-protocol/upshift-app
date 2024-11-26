import { ACTIVE_RPC_URLS } from '@/utils/constants/web3';
import AugustDigitalSDK from '@augustdigital/sdk';

export const augustSdk = new AugustDigitalSDK({
  augustKey: process.env.NEXT_PUBLIC_AUGUST_DIGITAL_API_KEY as string,
  providers: ACTIVE_RPC_URLS,
  env: process.env.NEXT_PUBLIC_DEV ? 'DEV' : 'PROD',
});
