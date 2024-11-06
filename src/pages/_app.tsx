import type { AppProps } from 'next/app';

import { WagmiProvider } from 'wagmi';
import { QueryClientProvider } from '@tanstack/react-query';

import { walletConfig } from '@/config/wallet';
import { queryClient } from '@/config/react-query';

import 'react-toastify/dist/ReactToastify.css';
import '@/styles/global.css';
import '@/styles/toast.css';
import { ThemeProvider } from '@/stores/theme';
import DevtoolsSkeleton from '@/ui/skeletons/devtools';
import { GoogleTagManager } from '@next/third-parties/google';
import { PoolsProvider } from '@/stores/pools';
import { ReferralsProvider } from '@/stores/referrals';

const MyApp = (props: AppProps) => {
  const { Component, pageProps } = props;

  // useEffect(() => {
  //   (async () => augustSdk.init())().catch(console.error);
  // }, []);

  return (
    <>
      <ThemeProvider>
        <WagmiProvider config={walletConfig}>
          <QueryClientProvider client={queryClient}>
            <ReferralsProvider>
              <PoolsProvider>
                <Component {...pageProps} />
              </PoolsProvider>
            </ReferralsProvider>

            <DevtoolsSkeleton />
          </QueryClientProvider>
        </WagmiProvider>
      </ThemeProvider>

      <GoogleTagManager gtmId="G-H1WDGRZH57" />
    </>
  );
};

export default MyApp;
