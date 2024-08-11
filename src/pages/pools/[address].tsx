import useFetcher from '@/hooks/use-fetcher';
import Base from '@/ui/skeletons/base';
import Section from '@/ui/skeletons/section';
import type { IAddress } from '@augustdigital/sdk';
import type { IBreadCumb } from '@/utils/types';
import AssetDisplay from '@/ui/atoms/asset-display';
import VaultInfo from '@/ui/organisms/vault-info';
import VaultAllocation from '@/ui/organisms/table-loans';
import Stack from '@mui/material/Stack';
import DepositModalMolecule from '@/ui/organisms/modal-deposit';
import WithdrawModalMolecule from '@/ui/organisms/modal-withdraw';
import type { UseQueryResult } from '@tanstack/react-query';
import MyPositionsTableOrganism from '@/ui/organisms/table-positions';
import { useAccount } from 'wagmi';
import type { GetStaticProps, InferGetStaticPropsType } from 'next';
import { augustSdk } from '@/config/august-sdk';

export async function getStaticPaths() {
  // Call an external API endpoint to get posts
  const res = await augustSdk.pools.getPools();
  // Get the paths we want to pre-render based on posts
  const paths = res.map((p) => ({
    params: { address: p.address },
  }));

  return { paths, fallback: false };
}

export const getStaticProps = (async (context) => {
  // Pass data to the page via props
  return {
    props: {
      pool: context?.params?.address as IAddress,
    },
  };
}) satisfies GetStaticProps<{
  pool: string | undefined;
}>;

const PoolPage = (params: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { address } = useAccount();

  const { data: pool, isLoading: poolLoading } = useFetcher({
    queryKey: ['lending-pool', params.pool],
  }) as UseQueryResult<any>; // TODO: interface

  const { data: positions, isLoading: positionsLoading } = useFetcher({
    queryKey: ['my-positions', address ?? ''],
  }) as UseQueryResult<any>; // TODO: interface

  function buildCrumbs(): IBreadCumb[] {
    return [
      {
        text: 'Earn',
        href: '/',
      },
    ];
  }

  return (
    <Base>
      <Section
        id="earn-table"
        title={pool?.name ?? ' '}
        description={
          (pool as any)?.description ??
          `The ${pool?.name ?? ''} vault aims to optimize yields by lending ${pool?.underlying?.symbol ?? ''} against blue chip crypto and real world asset (RWA) collateral markets, depending on market conditions. We call this the “dual engine”.`
        }
        breadcrumbs={buildCrumbs()}
        loading={+poolLoading}
        action={
          <Stack direction="column" alignItems={'end'} gap={2}>
            <AssetDisplay
              symbol={pool?.underlying?.symbol}
              img={`/assets/tokens/${pool?.underlying?.symbol}.png`}
              variant="glass"
              address={pool?.underlying?.address}
              loading={poolLoading}
            />
            <Stack direction={'row'} gap={1}>
              <DepositModalMolecule {...pool} />
              <WithdrawModalMolecule {...pool} />
            </Stack>
          </Stack>
        }
      >
        <Stack gap={3}>
          <Stack direction="column" gap={6} mt={2}>
            <VaultInfo {...pool} loading={+poolLoading} />
            <VaultAllocation {...pool} loading={poolLoading} />
          </Stack>
          <MyPositionsTableOrganism
            title="My Positions"
            data={positions}
            loading={+positionsLoading}
          />
        </Stack>
      </Section>
    </Base>
  );
};

export default PoolPage;
