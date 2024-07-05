import useFetcher from '@/hooks/use-fetcher';
import Base from '@/ui/skeletons/base';
import Section from '@/ui/skeletons/section';
// import { useRouter } from 'next/router';
import type { UseQueryResult } from '@tanstack/react-query';
import type { IPool } from '@augustdigital/types';
import type { IBreadCumb } from '@/utils/types';
import AssetDisplay from '@/ui/atoms/asset-display';
import VaultInfo from '@/ui/organisms/vault-info';
import VaultAllocation from '@/ui/organisms/vault-allocation';
import Stack from '@mui/material/Stack';
import DepositModalMolecule from '@/ui/molecules/deposit-modal';
import WithdrawModalMolecule from '@/ui/molecules/withdraw-modal';

const PoolPage = () => {
  // const router = useRouter();
  // const poolAddress = router.query.address! as string;
  const { data, isLoading } = useFetcher({
    queryKey: ['lending-pools'],
  }) as UseQueryResult<IPool[]>;
  const pool = data?.[0];

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
              <DepositModalMolecule {...(pool as IPool)} />
              <WithdrawModalMolecule {...(pool as IPool)} />
            </Stack>
          </Stack>
        }
      >
        <Stack direction="column" gap={6} mt={2}>
          <VaultInfo loading={isLoading} {...(pool as any)} />
          <VaultAllocation loading={isLoading} {...(pool as any)} />
        </Stack>
      </Section>
    </Base>
  );
};

export default PoolPage;
