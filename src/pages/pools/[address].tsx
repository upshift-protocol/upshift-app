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
import { useParams } from 'next/navigation';
import type { UseQueryResult } from '@tanstack/react-query';
import MyPositionsTableOrganism from '@/ui/organisms/table-positions';
import { isAddress } from 'viem';

const PoolPage = () => {
  const params = useParams();

  const { data: pool, isLoading: poolLoading } = useFetcher({
    queryKey: ['lending-pool', (params?.address as IAddress)!],
    enabled: !!params?.address && isAddress(params.address as string),
  }) as UseQueryResult<any>;

  const { data: positions, isLoading: positionsLoading } = useFetcher({
    queryKey: ['my-positions'],
  }) as UseQueryResult<any>;

  const isLoading = !pool || poolLoading;

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
        loading={+isLoading}
        title={pool?.name ?? ' '}
        description={
          (pool as any)?.description ??
          `${isLoading ? 'This' : 'The'} ${pool?.name ?? ''} vault aims to optimize yields by lending rsETH against blue chip crypto and real world asset (RWA) collateral markets, depending on market conditions. We call this the “dual engine”.`
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
            <VaultInfo loading={isLoading} {...pool} />
            <VaultAllocation loading={isLoading} {...pool} />
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

// export const getStaticPaths = (async () => {
//   return {
//     paths: [
//       {
//         params: {
//           name: 'next.js',
//         },
//       }, // See the "paths" section below
//     ],
//     fallback: true, // false or "blocking"
//   }
// }) satisfies GetStaticPaths

// export const getStaticProps = (async (context) => {
//   const res = await fetch('https://api.github.com/repos/vercel/next.js')
//   const repo = await res.json()
//   return { props: { repo } }
// }) satisfies GetStaticProps<{
//   repo: Repo
// }>

export default PoolPage;
