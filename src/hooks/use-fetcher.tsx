import MOCK_POOLS from '@/utils/mock-data';
import type { UndefinedInitialDataOptions } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';

type IFetchTypes = 'lending-pools';

interface IUseFetcher extends UndefinedInitialDataOptions {
  queryKey: (IFetchTypes | string)[];
  initialData: any;
}

export default function useFetcher({ queryKey, ...props }: IUseFetcher) {
  const type = queryKey[0];
  async function determineGetter() {
    switch (type) {
      case 'lending-pools': {
        // TODO: temp data
        return new Promise((res) => {
          setTimeout(() => res(MOCK_POOLS), 2000);
        });
      }
      default: {
        // TODO: temp data
        return new Promise((res) => {
          setTimeout(() => res(MOCK_POOLS), 2000);
        });
      }
    }
  }
  const query = useQuery({
    ...props,
    queryKey,
    queryFn: determineGetter,
  });

  return query;
}
