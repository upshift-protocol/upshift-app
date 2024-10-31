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
            <Component {...pageProps} />

            <DevtoolsSkeleton />
          </QueryClientProvider>
        </WagmiProvider>
      </ThemeProvider>

      <GoogleTagManager gtmId="G-H1WDGRZH57" />
    </>
  );
};

export default MyApp;
