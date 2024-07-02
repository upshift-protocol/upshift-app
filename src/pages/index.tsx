import OverviewStatsMolecule from '@/ui/molecules/overview-stats';
import PoolsTableOrganism from '@/ui/organisms/pools-table';
import Base from '@/ui/skeletons/base';
import Section from '@/ui/skeletons/section';

const HomePage = () => {
  return (
    <Base>
      <Section
        id="earn-table"
        title="Earn"
        description="Earn yields from real institutional loans via the Lazarev protocol. Democratizing high-yield investments traditionally limited to financial institutions."
        action={<OverviewStatsMolecule />}
      >
        <PoolsTableOrganism />
      </Section>
    </Base>
  );
};

export default HomePage;
