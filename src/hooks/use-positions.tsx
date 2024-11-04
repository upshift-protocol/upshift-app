import { augustSdk } from '@/config/august-sdk';
import { DEVELOPMENT_MODE } from '@/utils/constants/web3';
import { buildQueryKey } from '@/utils/helpers/query';
import { useQuery } from '@tanstack/react-query';
import { isAddress } from 'viem';

export default function usePositions(walletAddress?: string) {
  async function getPositions(wallet?: string) {
    if (!(wallet && isAddress(wallet))) {
      if (DEVELOPMENT_MODE)
        console.warn(
          '#useFetcher::my-positions:connected address is undefined',
          wallet,
        );
      return [];
    }
    const positions = await augustSdk.pools.getAllPositions(wallet);
    return positions;
  }

  const query = useQuery({
    queryKey: buildQueryKey('my-positions', undefined, walletAddress),
    queryFn: () => getPositions(walletAddress),
    enabled: !!walletAddress && isAddress(walletAddress),
  });

  return {
    positions: query,
    getPositions,
  };
}
