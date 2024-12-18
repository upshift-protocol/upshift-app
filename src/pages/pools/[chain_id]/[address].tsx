import BaseSkeleton from '@/ui/skeletons/base';
import Section from '@/ui/skeletons/section';
import type { IAddress, IChainId } from '@augustdigital/sdk';
import AssetDisplay from '@/ui/molecules/asset-display';
import VaultInfo from '@/ui/organisms/vault-info';
import VaultAllocation from '@/ui/organisms/table-loans';
import Stack from '@mui/material/Stack';
import DepositModalMolecule from '@/ui/organisms/modal-deposit';
import WithdrawModalMolecule from '@/ui/organisms/modal-withdraw';
import MyPositionsTableOrganism from '@/ui/organisms/table-positions';
import { useAccount } from 'wagmi';
import type { GetStaticProps, InferGetStaticPropsType } from 'next';
import { augustSdk } from '@/config/august-sdk';
import { Collapse } from '@mui/material';
import { useEffect, useState } from 'react';
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
    pools: { data: poolsData, isFetched: poolFetched },
  } = usePoolsStore();

  const pool = poolsData?.find((p) => p.address === params.pool) as any;

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
    <BaseSkeleton>
      <Section
        id="earn-table"
        title={pool?.name ?? ' '}
        description={
          pool?.description ||
          `${pool?.name} vault aims to optimize ${pool?.underlying?.symbol || 'its underlying deposit token'} yield by providing liquidity to blue chip DeFi protocols and maximizing future airdrop potential.`
        }
        // breadcrumbs={buildCrumbs()}
        loading={+!poolFetched && +!pool?.name}
        chainId={pool?.chainId}
        action={
          <Stack direction="column" alignItems={'end'} gap={2}>
            <AssetDisplay
              symbol={pool?.underlying?.symbol}
              variant="glass"
              address={pool?.underlying?.address}
              loading={!poolFetched && !pool?.underlying?.symbol}
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
            <VaultInfo
              {...pool}
              loading={+!poolFetched && +!pool?.totalSupply}
            />
            <Collapse in={walletConnected && Boolean(position?.length)}>
              <MyPositionsTableOrganism
                title="My Positions"
                data={position}
                loading={+positionsLoading}
              />
            </Collapse>

            <ExposureCharts
              pool={pool}
              loading={!(poolFetched && pool?.withLoans)}
            />

            <VaultAllocation {...pool} loading={!poolFetched} />
          </Stack>
        </Stack>
      </Section>
    </BaseSkeleton>
  );
};

export default PoolPage;
