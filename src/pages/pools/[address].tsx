import useFetcher from '@/hooks/use-fetcher';
import { OverallStats } from '@/ui/features/overall-stats';
import { Base } from '@/ui/layout/Base';
import { Section } from '@/ui/layout/Section';
import { useRouter } from 'next/router';

const PoolPage = () => {
  const router = useRouter();
  const poolAddress = router.query.address! as string;
  const { data, isLoading, isFetched } = useFetcher({
    queryKey: ['lending-pools', poolAddress],
    initialData: [],
  });

  return (
    <Base>
      <Section
        id="earn-table"
        title="Earn"
        description="Earn yields from real institutional loans via the Lazarev protocol. Democratizing high-yield investments traditionally limited to financial institutions."
        action={<OverallStats />}
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
