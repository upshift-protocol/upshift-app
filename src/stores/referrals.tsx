import type { IChildren } from '@/utils/types';
import React, {
  createContext,
  useContext,
  useEffect,
  useId,
  useState,
} from 'react';
import fetchCustom from '@/utils/fetcher';
import { useAccount } from 'wagmi';
import { getAddress } from 'viem';
import type { IReferralRecord } from '@/pages/api/referrals';
import { generateCode } from '@/utils/helpers/string';

// interfaces
interface ReferralsContextValue {
  referrals: IReferralRecord[];
  modalOpen: boolean;
  verifyCode: () => Promise<boolean>;
  codeInputId: string;
  isVerifying: boolean;
  message: string;
  codeInput: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

type ICodeObj = { code: string; used: boolean };

// helpers
const TIMEOUT_DELAY = 5000; // 5 seconds

// context
const ReferralsContext = createContext<ReferralsContextValue | undefined>(
  undefined,
);

// provider
const ReferralsProvider = ({ children }: IChildren) => {
  const codeInputId = useId();
  const { address } = useAccount();

  const [modalOpen, setModalOpen] = useState(false);
  const [referrals, setReferrals] = useState<any>(null);
  const [allCodes, setAllCodes] = useState<ICodeObj[]>([]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [message, setMessage] = useState('');
  const [codeInput, setCodeInput] = useState('');

  useEffect(() => {
    if (!address) return;

    (async () => {
      const referralsRes = await fetchCustom('get-referrals');
      if (referralsRes?.data && referralsRes.data.length && address) {
        // Retrieve user's referrals
        const connectedEoaReferrals = referralsRes.data.filter(
          (r) => getAddress(r.eoa) === getAddress(address),
        );
        console.log('ReferralsProvider::referrals:', connectedEoaReferrals);

        // has been referred
        if (connectedEoaReferrals.length) {
          setModalOpen(false);
        } else {
          if (address) setModalOpen(true);
          // Save all referral codes
          const codes: ICodeObj[] = [];
          referralsRes.data.forEach((r) => {
            r.codes.forEach((c) => {
              const codeUsed = !!referralsRes.data?.find(
                (ref) => ref.codeUsed === c,
              );
              codes.push({ code: c, used: codeUsed });
            });
          });
          console.log('ReferralsProvider::allCodes:', codes);

          setAllCodes(codes);
          setReferrals(connectedEoaReferrals);
          document.getElementById(codeInputId)?.focus();
        }
      }
    })().catch(console.error);
  }, [address]);

  async function verifyCode() {
    setIsVerifying(true);
    try {
      if (!allCodes.length || !address) {
        console.error('#verifyReferralCode: no referral codes found');
        return false;
      }
      const foundCode = allCodes.find((c) => c.code === codeInput);
      if (foundCode?.used) {
        setMessage('Code is already used. Please try again with another code.');
        return false;
      }
      // @todo implement logic to add new row in google sheets
      const newReferralRes = await fetchCustom('new-referral', {
        address,
        codeUsed: codeInput,
        newCode: generateCode(address),
      });
      if (newReferralRes.status !== 500) {
        setMessage('Code successfully verified! Welcome to Upshift Finance.');
        setTimeout(() => setModalOpen(false), TIMEOUT_DELAY);
        return true;
      }
      setMessage(
        'Something went wrong creating a new referral entry. Please try again later.',
      );
      return false;
    } catch (e) {
      console.error('#verifyReferralCode:', e);
      return false;
    } finally {
      setIsVerifying(false);
    }
  }

  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setCodeInput(e.target.value);
  }

  useEffect(() => {
    if (message) {
      const timeout = setTimeout(() => {
        setMessage('');
        setCodeInput('');
      }, TIMEOUT_DELAY);
      return () => clearTimeout(timeout);
    }
    return () => {};
  }, [message]);

  return (
    <ReferralsContext.Provider
      value={{
        onInputChange,
        codeInput,
        message,
        isVerifying,
        codeInputId,
        referrals,
        modalOpen,
        verifyCode,
      }}
    >
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
