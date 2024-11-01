import { queryClient } from '@/config/react-query';
import ToastPromise from '@/ui/molecules/toast-promise';
import { TIMES } from '@/utils/constants/time';
import { BUTTON_TEXTS } from '@/utils/constants/ui';
import { DEVELOPMENT_MODE } from '@/utils/constants/web3';
// import type { IDepositLogData } from '@/utils/types';
import type { IAddress, IChainId } from '@augustdigital/sdk';
import { toNormalizedBn } from '@augustdigital/sdk';
import { useEffect, useRef, useState } from 'react';
import type { Id } from 'react-toastify';
import { toast } from 'react-toastify';
import {
  readContract,
  simulateContract,
  waitForTransactionReceipt,
} from 'viem/actions';
import {
  useAccount,
  usePublicClient,
  useSwitchChain,
  useWalletClient,
} from 'wagmi';
import { abi as RewardDistributorABI } from '@/utils/abis/reward_distributor.json';

type IUseUnStakeProps = {
  rewardDistributor: IAddress;
  value?: string;
  token?: IAddress;
  name?: string;
  symbol?: string;
  decimals?: number;
  totalSupply?: string;
  chainId?: IChainId;
  clearInput?: () => void;
  closeModal?: () => void;
};

export default function useClaimReward(props: IUseUnStakeProps) {
  const { switchChainAsync } = useSwitchChain();
  // States
  const [expected, setExpected] = useState({
    fee: toNormalizedBn(0),
    out: toNormalizedBn(0),
    loading: false,
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [button, setButton] = useState({
    text: BUTTON_TEXTS.zero,
    disabled: true,
  });

  // Meta hooks
  const provider = usePublicClient({ chainId: props?.chainId });
  const { data: signer } = useWalletClient({ chainId: props?.chainId });
  const { address } = useAccount();

  // Functions
  async function handleClaimReward() {
    // checks
    if (!(address && provider && signer)) {
      console.warn('#handleClaim: no wallet is connected');
      return;
    }
    if (!props.token) {
      console.warn('#handleClaim: staking token address is undefined');
      return;
    }

    if (!props.value) {
      console.warn('#handleClaim: amount input is undefined');
      return;
    }
    // convert to normalized
    const normalized = toNormalizedBn(props.value, props.decimals);
    if (BigInt(normalized.raw) === BigInt(0)) {
      console.warn('#handleClaim: amount input is zero');
      return;
    }

    let unstakeDepositId: Id = 0;

    // functionality
    try {
      if (props?.chainId && props?.chainId !== provider.chain.id) {
        await switchChainAsync({ chainId: props?.chainId });
        return;
      }

      setIsLoading(true);
      setError('');

      // unstake input amount
      setButton({ text: BUTTON_TEXTS.submitting, disabled: true });

      unstakeDepositId = toast.loading(
        `Submitted Claiming for ${normalized.normalized} ${props.symbol}`,
      );
      const prepareDeposit = await simulateContract(provider, {
        account: address,
        address: props.rewardDistributor as IAddress,
        abi: RewardDistributorABI,
        functionName: 'getReward',
      });
      const depositHash = await signer.writeContract(prepareDeposit.request);

      await waitForTransactionReceipt(provider, {
        hash: depositHash,
      });

      ToastPromise(
        'redeem',
        normalized,
        unstakeDepositId,
        props.symbol,
        depositHash,
      );

      // Refetch queries
      queryClient.refetchQueries();

      // Success states
      setIsSuccess(true);
      setButton({ text: BUTTON_TEXTS.success, disabled: true });
      if (DEVELOPMENT_MODE) {
        console.log(
          '#handleClaim: successfully executed transaction',
          depositHash,
        );
      }
    } catch (e) {
      console.error('#handleClaim:', e);
      if (String(e).toLowerCase().includes('user rejected')) {
        toast.warn('User rejected transaction');
        setButton({ text: BUTTON_TEXTS.submit, disabled: false });
      } else {
        toast.error('Error executing transaction');
        setButton({ text: BUTTON_TEXTS.error, disabled: true });
      }
      if (String(e).includes(':')) {
        const err = String(e)?.split(':')[0];
        if (err) setError(err);
      } else {
        setError('Error occured while executing transaction');
      }
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        toast.dismiss(unstakeDepositId);
      }, 4000);
    }
  }

  async function simulate() {
    try {
      if (!props.value) {
        setExpected((_prev) => ({
          fee: toNormalizedBn(BigInt(0), props.decimals),
          out: toNormalizedBn(BigInt(0), props.decimals),
          loading: false,
        }));
        return;
      }

      console.log(props, 'props-claim');
      if (!(provider && props.token && props.rewardDistributor && address))
        return;

      const out = await readContract(provider, {
        account: address,
        address: props.rewardDistributor,
        abi: RewardDistributorABI,
        functionName: 'getReward',
      });

      const fee = BigInt(200000);
      setExpected((_prev) => ({
        fee: toNormalizedBn(fee, props.decimals),
        out: toNormalizedBn((out as bigint) || BigInt(0), props.decimals),
        loading: false,
      }));
      console.log('out-claim', out);
    } catch (e) {
      setExpected((_prev) => ({
        fee: toNormalizedBn(BigInt(0), props.decimals),
        out: toNormalizedBn(BigInt(0), props.decimals),
        loading: false,
      }));
    }
  }

  function reset() {
    props?.clearInput?.();
    setError('');
    setIsLoading(false);
    setIsSuccess(false);
    setButton({ text: BUTTON_TEXTS.zero, disabled: true });
  }

  // useEffects
  useEffect(() => {
    const val = toNormalizedBn(props.value || '0', props.decimals);
    console.log(val, 'val-claim');
    if (BigInt(val.raw) === BigInt(0)) {
      setButton({ text: BUTTON_TEXTS.zero, disabled: true });
    } else {
      setButton({ text: BUTTON_TEXTS.submit, disabled: false });
      setError('');
    }
  }, [props.value]);

  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();
  useEffect(() => {
    clearTimeout(timeoutRef.current);
    setExpected((_prev) => ({
      ..._prev,
      loading: true,
    }));
    timeoutRef.current = setTimeout(() => simulate(), TIMES.load);
    return () => clearTimeout(timeoutRef.current);
  }, [props.value]);

  useEffect(() => {
    if (isSuccess) {
      const timeout = setTimeout(() => {
        reset();
        props?.closeModal?.();
      }, 4000);
      return () => {
        clearTimeout(timeout);
      };
    }
    return () => {};
  }, [isSuccess]);

  return {
    handleClaimReward,
    button,
    isLoading,
    error,
    isSuccess,
    expected,
  };
}
