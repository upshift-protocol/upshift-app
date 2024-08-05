import useFetcher from '@/hooks/use-fetcher';
import Base from '@/ui/skeletons/base';
import Section from '@/ui/skeletons/section';
import { getLendingPool, getLendingPools } from '@augustdigital/sdk';
import type {
  IPoolWithUnderlying,
  IAddress,
  IChainId,
} from '@augustdigital/sdk';
import type { IBreadCumb } from '@/utils/types';
import AssetDisplay from '@/ui/atoms/asset-display';
import VaultInfo from '@/ui/organisms/vault-info';
import VaultAllocation from '@/ui/organisms/table-loans';
import Stack from '@mui/material/Stack';
import DepositModalMolecule from '@/ui/organisms/modal-deposit';
import WithdrawModalMolecule from '@/ui/organisms/modal-withdraw';
import type { UseQueryResult } from '@tanstack/react-query';
import MyPositionsTableOrganism from '@/ui/organisms/table-positions';
import type { GetStaticProps, InferGetStaticPropsType } from 'next';
import { FALLBACK_CHAINID, INFURA_API_KEY } from '@/utils/constants/web3';
import { stringify } from '@/utils/helpers/string';

const infuraOptions = {
  apiKey: INFURA_API_KEY,
  chainId: FALLBACK_CHAINID as IChainId, // TODO: make dynamic later
};

export async function getStaticPaths() {
  // Call an external API endpoint to get posts
  const res = await getLendingPools(infuraOptions);

  // Get the paths we want to pre-render based on posts
  const paths = res.map((p) => ({
    params: { address: p.address },
  }));

  return { paths, fallback: false };
}

export const getStaticProps = (async (context) => {
  // Fetch data from external API
  const res = await getLendingPool(context?.params?.address as IAddress, {
    apiKey: INFURA_API_KEY,
    chainId: FALLBACK_CHAINID, // TODO: make dynamic later
  });
  // Pass data to the page via props
  return { props: { pool: stringify(res) } };
}) satisfies GetStaticProps<{
  pool: string | undefined;
}>;

const PoolPage = ({
  pool: poolString,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const pool: IPoolWithUnderlying = poolString ? JSON.parse(poolString) : {};

  const { data: positions, isLoading: positionsLoading } = useFetcher({
    queryKey: ['my-positions'],
  }) as UseQueryResult<any>;

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
          `The ${pool?.name ?? ''} vault aims to optimize yields by lending rsETH against blue chip crypto and real world asset (RWA) collateral markets, depending on market conditions. We call this the “dual engine”.`
        }
        breadcrumbs={buildCrumbs()}
        action={
          <Stack direction="column" alignItems={'end'} gap={2}>
            <AssetDisplay
              symbol={pool?.underlying?.symbol}
              img={`/assets/tokens/${pool?.underlying?.symbol}.png`}
              variant="glass"
              address={pool?.underlying?.address}
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
            <VaultInfo {...pool} />
            <VaultAllocation {...pool} />
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
