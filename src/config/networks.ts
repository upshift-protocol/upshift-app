import { INSTANCE, ALCHEMY_API_KEY, NETWORK } from '@/utils/constants';
import { http } from 'viem';
import { avalanche, base, localhost, mainnet } from 'viem/chains';

export const RPC_URLS = {
  [avalanche.id]: `https://avax-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
  [mainnet.id]: `https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
  [base.id]: `https://base-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
};

export const ACTIVE_RPC_URLS = () => {
  switch (INSTANCE) {
    case 'lombard': {
      return {
        [mainnet.id]: RPC_URLS[mainnet.id],
        [base.id]: RPC_URLS[base.id],
      };
    }
    case 'treehouse':
    case 'ethena': {
      return {
        [mainnet.id]: RPC_URLS[mainnet.id],
      };
    }
    case 'avax': {
      return {
        [avalanche.id]: RPC_URLS[avalanche.id],
        [mainnet.id]: RPC_URLS[mainnet.id],
      };
    }
    default: {
      return {
        [mainnet.id]: RPC_URLS[mainnet.id],
        [avalanche.id]: RPC_URLS[avalanche.id],
        [base.id]: RPC_URLS[base.id],
      };
    }
  }
};

export const ACTIVE_NETWORKS = () => {
  if (NETWORK === 'localhost') return [mainnet, avalanche, base, localhost];
  if (INSTANCE === 'avax') return [avalanche, mainnet];
  if (INSTANCE === 'lombard') return [mainnet, base];
  if (INSTANCE === 'treehouse' || INSTANCE === 'ethena') return [mainnet];
  return [mainnet, avalanche, base];
};

export const ACTIVE_TRANSPORTS = {
  [mainnet.id]: http(RPC_URLS[mainnet.id]),
  [avalanche.id]: http(RPC_URLS[avalanche.id]),
  [base.id]: http(RPC_URLS[base.id]),
  [localhost.id]: http(),
};
