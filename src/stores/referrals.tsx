import type { IChildren } from '@/utils/types';
import type { Dispatch, SetStateAction } from 'react';
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
import { generateCode } from '@/utils/helpers/string';
import { REFERRALS_ENABLED } from '@/utils/constants';

// interfaces
type ICodeObj = { code: string; used: boolean; eoa: string | undefined };

interface ReferralsContextValue {
  referrals: ICodeObj[];
  modalOpen: boolean;
  verifyCode: () => Promise<boolean>;
  codeInputId: string;
  isVerifying: boolean;
  message: string;
  codeInput: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setModalOpen: Dispatch<SetStateAction<boolean>>;
}

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
  const [referrals, setReferrals] = useState<ICodeObj[]>([]);
  const [allCodes, setAllCodes] = useState<ICodeObj[]>([]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [message, setMessage] = useState('');
  const [codeInput, setCodeInput] = useState('');

  async function getReferrals() {
    if (!REFERRALS_ENABLED) return;
    const referralsRes = await fetchCustom('get-referrals');
    if (referralsRes?.data && referralsRes.data.length && address) {
      // Retrieve user's referrals
      const connectedEoaReferrals = referralsRes.data.find(
        (r) => getAddress(r.eoa) === getAddress(address),
      );

      // has been referred
      if (connectedEoaReferrals) {
        setAllCodes([]);
        const codeUsage: ICodeObj[] = [];
        connectedEoaReferrals.codes.forEach((code) => {
          const codeUsed = referralsRes.data?.find(
            (ref) => ref.codeUsed === code,
          );
          codeUsage.push({
            code,
            used: !!codeUsed,
            eoa: codeUsed?.eoa,
          });
        });
        setReferrals(codeUsage);
        setModalOpen(false);
      } else {
        setReferrals([]);
        if (address) setModalOpen(true);
        // Save all referral codes
        const codes: ICodeObj[] = [];
        referralsRes.data.forEach((r) => {
          r.codes.forEach((c) => {
            const codeUsed = !!referralsRes.data?.find(
              (ref) => ref.codeUsed === c,
            );
            codes.push({ code: c, used: codeUsed, eoa: r.eoa });
          });
        });
        setAllCodes(codes);
        document.getElementById(codeInputId)?.focus();
      }
    }
  }

  function reset() {
    setModalOpen(false);
    setReferrals([]);
    setAllCodes([]);
  }

  // get referrals when user disconnects wallet
  useEffect(() => {
    if (!(address && REFERRALS_ENABLED)) return;
    (async () => getReferrals())().catch(console.error);
  }, [address]);

  // close modal if modal is open when user disconnects wallet
  useEffect(() => {
    if (modalOpen && !address) reset();
  }, [address, modalOpen]);

  async function verifyCode() {
    setIsVerifying(true);
    try {
      if (!allCodes.length || !address) {
        console.error('#verifyReferralCode: no referral codes found');
        return false;
      }
      const foundCode = allCodes.find((c) => c.code === codeInput);
      if (!foundCode) {
        setMessage(
          'Invalid referral code. Please check the format and try again.',
        );
        return false;
      }
      if (foundCode?.used === true) {
        setMessage('Code is already used. Please try again with another code.');
        return false;
      }
      // @todo implement logic to add new row in google sheets
      const newReferralRes = await fetchCustom('new-referral', {
        address,
        codeUsed: codeInput,
        newCode: [
          // give new user 5 referral codes
          generateCode(address),
          generateCode(address),
          generateCode(address),
          generateCode(address),
          generateCode(address),
        ].join(','),
      });
      if (newReferralRes.status !== 500) {
        setMessage('Code successfully verified! Welcome to Upshift Finance.');
        (async () => getReferrals())().catch(console.error);
        setTimeout(() => setModalOpen(false), TIMEOUT_DELAY);
        return true;
      }
      setMessage(
        'Something went wrong creating a new referral entry. Please try again later.',
      );
      return false;
    } catch (e) {
      console.error('#verifyCode:', e);
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
        setModalOpen,
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
