import { ThemeProvider } from '@/stores/theme';
import '@/styles/global.css';

import type { AppProps } from 'next/app';

const MyApp = (props: AppProps) => {
  const { Component, pageProps } = props;
  return (
    <ThemeProvider>
      <Component {...pageProps} />
    </ThemeProvider>
  );
};

export default MyApp;
