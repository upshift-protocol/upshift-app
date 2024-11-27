import AugustDigitalSDK from '@augustdigital/sdk';
import { ACTIVE_RPC_URLS } from './networks';

export const augustSdk = new AugustDigitalSDK({
  augustKey: process.env.NEXT_PUBLIC_AUGUST_DIGITAL_API_KEY as string,
  providers: ACTIVE_RPC_URLS(),
  env: process.env.NEXT_PUBLIC_DEV ? 'DEV' : 'PROD',
});
