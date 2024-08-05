import useFetcher from '@/hooks/use-fetcher';
import Base from '@/ui/skeletons/base';
import Section from '@/ui/skeletons/section';
import { getLendingPool } from '@augustdigital/sdk';
import type { IPoolWithUnderlying, IAddress } from '@augustdigital/sdk';
import type { IBreadCumb } from '@/utils/types';
import AssetDisplay from '@/ui/atoms/asset-display';
import VaultInfo from '@/ui/organisms/vault-info';
import VaultAllocation from '@/ui/organisms/table-loans';
import Stack from '@mui/material/Stack';
import DepositModalMolecule from '@/ui/organisms/modal-deposit';
import WithdrawModalMolecule from '@/ui/organisms/modal-withdraw';
import type { UseQueryResult } from '@tanstack/react-query';
import MyPositionsTableOrganism from '@/ui/organisms/table-positions';
import type { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { FALLBACK_CHAINID, INFURA_API_KEY } from '@/utils/constants/web3';
import { stringify } from '@/utils/helpers/string';

export const getServerSideProps = (async (context) => {
  // Fetch data from external API
  const res = await getLendingPool(context?.params?.address as IAddress, {
    apiKey: INFURA_API_KEY,
    chainId: FALLBACK_CHAINID, // TODO: make dynamic later
  });
  // Pass data to the page via props
  return { props: { pool: stringify(res) } };
}) satisfies GetServerSideProps<{ pool: string | undefined }>;

const PoolPage = ({
  pool: poolString,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  // const params = useParams();
  const pool: IPoolWithUnderlying = poolString ? JSON.parse(poolString) : {};
  // const { data: pool, isLoading: poolLoading } = useFetcher({
  //   queryKey: ['lending-pool', (params?.address as IAddress)!],
  //   enabled: !!params?.address && isAddress(params.address as string),
  // }) as UseQueryResult<any>;

  const { data: positions, isLoading: positionsLoading } = useFetcher({
    queryKey: ['my-positions'],
  }) as UseQueryResult<any>;

  // const isLoading = !pool || poolLoading;

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
        // loading={+isLoading}
        title={pool?.name ?? ' '}
        description={
          (pool as any)?.description ??
          // `${isLoading ? 'This' : 'The'}
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
            <VaultInfo
              // loading={isLoading}
              {...pool}
            />
            <VaultAllocation
              // loading={isLoading}
              {...pool}
            />
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
