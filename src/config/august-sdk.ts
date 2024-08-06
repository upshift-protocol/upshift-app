import { INFURA_API_KEY } from '@/utils/constants/web3';
import AugustDigitalSDK, { FALLBACK_CHAINID } from '@augustdigital/sdk';

export const augustSdk = new AugustDigitalSDK({
  augustKey: process.env.NEXT_PUBLIC_AUGUST_DIGITAL_API_KEY as string,
  infuraKey: INFURA_API_KEY,
  chainIds: [FALLBACK_CHAINID],
});
