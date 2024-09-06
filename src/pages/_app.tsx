import type { AppProps } from 'next/app';

import { WagmiProvider } from 'wagmi';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { walletConfig } from '@/config/wallet';
import { queryClient } from '@/config/react-query';

import 'react-toastify/dist/ReactToastify.css';
import '@/styles/global.css';
import '@/styles/toast.css';
import { ThemeProvider } from '@/stores/theme';

const MyApp = (props: AppProps) => {
  const { Component, pageProps } = props;

  // useEffect(() => {
  //   (async () => augustSdk.init())().catch(console.error);
  // }, []);

  return (
    <ThemeProvider>
      <WagmiProvider config={walletConfig}>
        <QueryClientProvider client={queryClient}>
          <Component {...pageProps} />
          <ReactQueryDevtools />
        </QueryClientProvider>
      </WagmiProvider>
    </ThemeProvider>
  );
};

export default MyApp;
