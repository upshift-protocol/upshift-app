import type { AppProps } from 'next/app';
import '@/styles/global.css';
import { ThemeProvider } from '@/stores/theme';

import { WagmiProvider } from 'wagmi';
import { QueryClientProvider } from '@tanstack/react-query';

import { walletConfig } from '@/config/wallet';
import { queryClient } from '@/config/react-query';

const MyApp = (props: AppProps) => {
  const { Component, pageProps } = props;
  return (
    <ThemeProvider>
      <WagmiProvider config={walletConfig}>
        <QueryClientProvider client={queryClient}>
          <Component {...pageProps} />
        </QueryClientProvider>
      </WagmiProvider>
    </ThemeProvider>
  );
};

export default MyApp;
