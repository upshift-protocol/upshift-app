import type { IChildren } from '@/utils/types';
import React, { createContext, useContext, useEffect, useState } from 'react';
import fetchCustom from '@/utils/fetcher';
import { useAccount } from 'wagmi';
import { getAddress } from 'viem';
import type { IReferralRecord } from '@/pages/api/referrals';

interface ReferralsContextValue {
  referrals: IReferralRecord[];
}

const ReferralsContext = createContext<ReferralsContextValue | undefined>(
  undefined,
);

const ReferralsProvider = ({ children }: IChildren) => {
  const [referrals, setReferrals] = useState<any>(null);
  const { address } = useAccount();

  useEffect(() => {
    (async () => {
      const referralsRes = await fetchCustom('referrals');
      if (referralsRes?.data && referralsRes.data.length && address) {
        const connectedEoaReferrals = referralsRes.data.filter(
          (r) => getAddress(r.eoa) === getAddress(address),
        );
        console.log('referrals:', connectedEoaReferrals);
        setReferrals(connectedEoaReferrals);
      }
    })().catch(console.error);
  }, [address]);

  return (
    <ReferralsContext.Provider value={{ referrals }}>
      {children}
    </ReferralsContext.Provider>
  );
};

const useReferralsStore = (): ReferralsContextValue => {
  const context = useContext(ReferralsContext);
  if (!context) {
    throw new Error(
      'useReferralsStore must be used within a ReferralsProvider',
    );
  }
  return context;
};

export { ReferralsProvider, useReferralsStore };
