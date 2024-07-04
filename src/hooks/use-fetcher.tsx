import MOCK_POOLS from '@/utils/mock-data';
import type { UndefinedInitialDataOptions } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';

type IFetchTypes = 'lending-pools';

interface IUseFetcher extends UndefinedInitialDataOptions {
  queryKey: (IFetchTypes | string)[];
  initialData?: any;
  formatter?: (data: any) => any;
}

export default function useFetcher({
  queryKey,
  formatter,
  ...props
}: IUseFetcher) {
  const type = queryKey[0];
  async function determineGetter() {
    switch (type) {
      case 'lending-pools': {
        // TODO: temp data
        return new Promise((res) => {
          setTimeout(() => res(MOCK_POOLS), 1000);
        });
      }
      default: {
        // TODO: temp data
        return new Promise((res) => {
          setTimeout(() => res(MOCK_POOLS), 1000);
        });
      }
    }
  }

  const masterGetter = async () => {
    if (typeof formatter !== 'undefined')
      return formatter(await determineGetter());
    return determineGetter();
  };

  const query = useQuery({
    ...props,
    queryKey,
    queryFn: masterGetter,
  });

  return query;
}
