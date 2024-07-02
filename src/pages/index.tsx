import { OverallStats } from '@/ui/features/overall-stats';
import { EarnTable } from '@/ui/features/earn-table';
import { Base } from '@/ui/layout/Base';
import { Section } from '@/ui/layout/Section';

const HomePage = () => {
  return (
    <Base>
      <Section
        id="earn-table"
        title="Earn"
        description="Earn yields from real institutional loans via the Lazarev protocol. Democratizing high-yield investments traditionally limited to financial institutions."
        action={<OverallStats />}
      >
        <EarnTable />
      </Section>
    </Base>
  );
};

export default HomePage;
