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
import NewReferralModalMolecule from '@/ui/organisms/modal-new-referral';

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
            {/* START: app providers */}
            <ReferralsProvider>
              <PoolsProvider>
                {/* START: main injection */}
                <Component {...pageProps} />
                <NewReferralModalMolecule />
                {/* END: main injection */}
              </PoolsProvider>
            </ReferralsProvider>
            {/* END: app providers */}

            {/* START: devtools */}
            <DevtoolsSkeleton />
            {/* END: devtools */}
          </QueryClientProvider>
        </WagmiProvider>
      </ThemeProvider>

      <GoogleTagManager
        gtmId={process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER || ''}
      />
    </>
  );
};

export default MyApp;
