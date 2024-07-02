import useFetcher from '@/hooks/use-fetcher';
import Base from '@/ui/skeletons/base';
import Section from '@/ui/skeletons/section';
import { useRouter } from 'next/router';
import OverviewStats from '@/ui/molecules/overview-stats';

const PoolPage = () => {
  const router = useRouter();
  const poolAddress = router.query.address! as string;
  const { data, isLoading, isFetched } = useFetcher({
    queryKey: ['lending-pools', poolAddress],
  });

  return (
    <Base>
      <Section
        id="earn-table"
        title="Earn"
        description="Earn yields from real institutional loans via the Lazarev protocol. Democratizing high-yield investments traditionally limited to financial institutions."
        action={<OverviewStats />}
      >
        <div>{JSON.stringify(router.query.address)}</div>
        <div>{poolAddress}</div>
        <div>{JSON.stringify(data)}</div>
        <div>{String(isLoading)}</div>
        <div>{String(!isFetched)}</div>
      </Section>
    </Base>
  );
};

export default PoolPage;
