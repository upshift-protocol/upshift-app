import useFetcher from '@/hooks/use-fetcher';
import Base from '@/ui/skeletons/base';
import Section from '@/ui/skeletons/section';
import type { IAddress, IChainId } from '@augustdigital/sdk';
import AssetDisplay from '@/ui/atoms/asset-display';
import VaultInfo from '@/ui/organisms/vault-info';
import VaultAllocation from '@/ui/organisms/table-loans';
import Stack from '@mui/material/Stack';
import DepositModalMolecule from '@/ui/organisms/modal-deposit';
import WithdrawModalMolecule from '@/ui/organisms/modal-withdraw';
import { type UseQueryResult } from '@tanstack/react-query';
import MyPositionsTableOrganism from '@/ui/organisms/table-positions';
import { useAccount } from 'wagmi';
import type { GetStaticProps, InferGetStaticPropsType } from 'next';
import { augustSdk } from '@/config/august-sdk';
import { Collapse } from '@mui/material';
import { useEffect, useState } from 'react';
import { FALLBACK_TOKEN_IMG } from '@/utils/constants/ui';

import ExposureCharts from '@/ui/organisms/exposure-charts';
import { usePoolsStore } from '@/stores/pools';

export async function getStaticPaths() {
  // Call an external API endpoint to get posts
  const paths = await Promise.all(
    Object.keys(augustSdk.providers).map(async (chain) => {
      augustSdk.switchNetwork(Number(chain) as IChainId);
      const res = await augustSdk.pools.getPools();
      // Get the paths we want to pre-render based on posts
      return res.map((p) => ({
        params: { address: p.address, chain_id: chain },
      }));
    }),
  );
  const flattenedPaths = paths.flat();
  return { paths: flattenedPaths, fallback: false };
}

export const getStaticProps = (async (context) => {
  // Pass data to the page via props
  return {
    props: {
      chain_id: Number(context?.params?.chain_id) as IChainId,
      pool: context?.params?.address as IAddress,
    },
  };
}) satisfies GetStaticProps<{
  pool: string | undefined;
  chain_id: IChainId | undefined;
}>;

const PoolPage = (params: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { address } = useAccount();
  const [walletConnected, setWalletConnected] = useState(false);
  const [position, setPosition] = useState<any>([]);

  const {
    positions: { data: positions, isLoading: positionsLoading },
  } = usePoolsStore();

  const { data: pool, isLoading: poolLoading } = useFetcher({
    queryKey: ['lending-pool', params.pool, String(params.chain_id)],
  }) as UseQueryResult<any>; // TODO: interface

  useEffect(() => {
    if (positions?.length) {
      setPosition(positions.filter((p) => p.address === params.pool));
    }
  }, [positions?.length, params?.pool]);

  useEffect(() => {
    if (address) setWalletConnected(true);
    else setWalletConnected(false);
  }, [address]);

  return (
    <Base>
      <Section
        id="earn-table"
        title={pool?.name ?? ' '}
        description={
          pool?.description ||
          `${pool?.name} vault aims to optimize ${pool?.underlying?.symbol || 'its underlying deposit token'} yield by providing liquidity to blue chip DeFi protocols and maximizing future airdrop potential.`
        }
        // breadcrumbs={buildCrumbs()}
        loading={+poolLoading}
        chainId={pool?.chainId}
        action={
          <Stack direction="column" alignItems={'end'} gap={2}>
            <AssetDisplay
              symbol={pool?.underlying?.symbol}
              img={
                pool?.underlying?.symbol
                  ? `/img/tokens/${pool?.underlying?.symbol}.svg`
                  : FALLBACK_TOKEN_IMG
              }
              variant="glass"
              address={pool?.underlying?.address}
              loading={poolLoading}
            />
            <Stack direction={'row'} gap={1}>
              <DepositModalMolecule {...pool} chainId={params?.chain_id} />
              <WithdrawModalMolecule {...pool} chainId={params?.chain_id} />
            </Stack>
          </Stack>
        }
      >
        <Stack gap={3}>
          <Stack direction="column" gap={4} mt={2}>
            <VaultInfo {...pool} loading={+poolLoading} />
            <Collapse in={walletConnected && Boolean(position?.length)}>
              <MyPositionsTableOrganism
                title="My Positions"
                data={position}
                loading={+positionsLoading}
              />
            </Collapse>

            <ExposureCharts pool={pool} />
            <VaultAllocation {...pool} loading={poolLoading} />
          </Stack>
        </Stack>
      </Section>
    </Base>
  );
};

export default PoolPage;
