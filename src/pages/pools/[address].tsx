import useFetcher from '@/hooks/use-fetcher';
import Base from '@/ui/skeletons/base';
import Section from '@/ui/skeletons/section';
// import { useRouter } from 'next/router';
import type { IAddress, IPoolWithUnderlying } from '@augustdigital/sdk';
import type { IBreadCumb } from '@/utils/types';
import AssetDisplay from '@/ui/atoms/asset-display';
import VaultInfo from '@/ui/organisms/vault-info';
import VaultAllocation from '@/ui/organisms/vault-allocation';
import Stack from '@mui/material/Stack';
import DepositModalMolecule from '@/ui/molecules/deposit-modal';
import WithdrawModalMolecule from '@/ui/molecules/withdraw-modal';
import { useParams } from 'next/navigation';

const PoolPage = () => {
  const params = useParams();

  const { data, isLoading: poolLoading } = useFetcher({
    queryKey: ['lending-pool', (params?.address as IAddress)!],
    disabled: !params?.address,
  });

  const pool = data as IPoolWithUnderlying;
  const isLoading = !data || poolLoading;

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
        loading={isLoading}
        title={pool?.name ?? ' '}
        description={
          (pool as any)?.description ??
          `${isLoading ? 'This' : 'The'} ${pool?.name ?? ''} vault aims to optimize yields by lending USDC against blue chip crypto and real world asset (RWA) collateral markets, depending on market conditions. We call this the “dual engine”.`
        }
        breadcrumbs={buildCrumbs()}
        action={
          <Stack direction="column" alignItems={'end'} gap={2}>
            <AssetDisplay />
            <Stack direction={'row'} gap={1}>
              <DepositModalMolecule {...pool} />
              <WithdrawModalMolecule {...pool} />
            </Stack>
          </Stack>
        }
      >
        <Stack direction="column" gap={6} mt={2}>
          <VaultInfo loading={isLoading} {...pool} />
          <VaultAllocation loading={isLoading} {...pool} />
        </Stack>
      </Section>
    </Base>
  );
};

export default PoolPage;
