import { queryClient } from '@/config/react-query';
import { BUTTON_TEXTS, DEVELOPMENT_MODE } from '@/utils/constants';
import { TIMES } from '@/utils/constants/time';
import type { IAddress, IChainId, INormalizedNumber } from '@augustdigital/sdk';
import { ABI_LENDING_POOLS, toNormalizedBn } from '@augustdigital/sdk';
import { useEffect, useRef, useState } from 'react';
import type { Id } from 'react-toastify';
import { toast } from 'react-toastify';
import { erc20Abi } from 'viem';
import { readContract, simulateContract } from 'viem/actions';
import {
  useAccount,
  useChainId,
  usePublicClient,
  useReadContract,
  useReadContracts,
  useSwitchChain,
  useWalletClient,
} from 'wagmi';
import ToastPromise from '@/ui/molecules/toast-promise';
import SLACK from '@/utils/slack';
import { sendGTMEvent } from '@next/third-parties/google';

type IUseWithdrawProps = {
  value?: string;
  asset?: IAddress;
  clearInput?: () => void;
  pool?: IAddress;
  poolName?: string;
  closeModal?: () => void;
  redemptions?: any; // TODO: add type interface
  chainId?: number;
};

type IRedemption = {
  day: INormalizedNumber;
  month: INormalizedNumber;
  year: INormalizedNumber;
};

export default function useWithdraw(props: IUseWithdrawProps) {
  const { switchChainAsync } = useSwitchChain();
  const chainId = useChainId();
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
  const [selectedRedemption, setSelectedRedemption] =
    useState<IRedemption | null>(null);

  // Meta hooks
  const provider = usePublicClient();
  const { data: signer } = useWalletClient();
  const { address } = useAccount();
  const { data: decimals } = useReadContract({
    address: props.asset,
    abi: erc20Abi,
    functionName: 'decimals',
    chainId: props?.chainId,
  });

  const { data: poolMetaData, isLoading: poolMetaLoading } = useReadContracts({
    contracts: [
      {
        address: props.asset,
        abi: erc20Abi,
        functionName: 'symbol',
        chainId: props?.chainId,
      },
      {
        address: props.pool,
        abi: ABI_LENDING_POOLS,
        functionName: 'lagDuration',
        chainId: props?.chainId,
      },
    ],
  });
  const symbol = poolMetaData?.[0]?.result;
  const lockTime = poolMetaData?.[1]?.result;

  // Functions
  async function requestWithdraw() {
    // checks
    if (!(address && provider)) {
      console.warn('#requestWithdraw: no wallet is connected');
      return;
    }
    if (!props.pool) {
      console.warn('#requestWithdraw: pool address is undefined');
      return;
    }
    if (!props.asset) {
      console.warn('#requestWithdraw: pool asset is undefined');
      return;
    }
    if (!props.value) {
      console.warn('#requestWithdraw: amount input is undefined');
      return;
    }
    // normalize input amount
    const normalized = toNormalizedBn(props.value, decimals);
    if (BigInt(normalized.raw || 0) === BigInt(0)) {
      console.warn('#requestWithdraw: amount input is zero');
      return;
    }

    let redeemToastId: Id = 0;

    // functionality
    try {
      // switch chains if necessary
      if (props?.chainId && props?.chainId !== provider.chain.id) {
        await switchChainAsync({ chainId: props?.chainId });
        return;
      }

      setIsLoading(true);
      setError('');

      // Request withdrawal of input amount
      redeemToastId = toast.loading(
        `Submitted redeem for ${normalized.normalized} ${symbol}`,
        {
          closeButton: true,
        },
      );
      setButton({ text: BUTTON_TEXTS.submitting, disabled: true });

      const prepareRedeem = await simulateContract(provider, {
        account: address,
        address: props.pool,
        abi: ABI_LENDING_POOLS,
        functionName: 'requestRedeem',
        args: [BigInt(normalized.raw), address, address],
      });
      const redeemHash = await signer?.writeContract(prepareRedeem.request);
      ToastPromise(
        'redeem',
        normalized,
        redeemToastId,
        symbol,
        redeemHash,
        undefined,
        chainId as IChainId,
      );

      // Success states
      setIsSuccess(true);
      setButton({ text: BUTTON_TEXTS.success, disabled: true });
      if (DEVELOPMENT_MODE) {
        console.log(
          '#requestWithdraw: successfully executed transaction',
          redeemHash,
        );
      }

      // Refetch queries and log to google analytics
      queryClient.invalidateQueries();
      process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER
        ? sendGTMEvent({
            event: 'redeem-request',
            pool: props.pool,
            chain: chainId,
            amount: normalized.normalized,
            symbol,
            hash: redeemHash,
          })
        : console.warn('GOOGLE_TAG_MANAGER env var is not available');
    } catch (e) {
      console.error('#requestWithdraw', e);
      toast.dismiss(redeemToastId);
      if (String(e).toLowerCase().includes('user rejected')) {
        toast.warn('User rejected transaction');
        setButton({ text: BUTTON_TEXTS.submit, disabled: false });
      } else {
        toast.error('Error executing transaction');
        setButton({ text: BUTTON_TEXTS.error, disabled: true });
        SLACK.interactionError(
          String(e),
          props?.pool,
          String(props?.poolName),
          props?.chainId || chainId,
          address,
          'Request Redeem',
        );
      }
      if (String(e).includes(':')) {
        const err = String(e)?.split(':')[0];
        if (err) setError(err);
      } else {
        setError('Error occured while executing transaction');
      }
    } finally {
      setIsLoading(false);
    }
  }

  async function handleWithdraw(redemption: IRedemption | null) {
    // checks
    if (!(address && provider)) {
      console.warn('#handleWithdraw: no wallet is connected');
      return;
    }
    if (!props.pool) {
      console.warn('#handleWithdraw: pool address is undefined');
      return;
    }
    if (!props.asset) {
      console.warn('#handleWithdraw: pool asset is undefined');
      return;
    }
    if (!props.value) {
      console.warn('#handleWithdraw: amount input is undefined');
      return;
    }
    // normalize input amount
    const normalized = toNormalizedBn(props.value, decimals);
    console.log('normalized:', normalized);
    if (BigInt(normalized.raw) === BigInt(0)) {
      console.warn('#requestWithdraw: amount input is zero');
      return;
    }

    // // find appropriate redemptions
    // const foundRedemption = props.redemptions?.find(
    //   (redemption: any) => redemption.amount.raw === normalized.raw,
    // );
    const day = selectedRedemption?.day || redemption?.day;
    const month = selectedRedemption?.month || redemption?.month;
    const year = selectedRedemption?.year || redemption?.year;

    // if redemption not found
    if (!(day && month && year)) {
      console.error(
        '#requestWithdraw: could not find redemption',
        props?.redemptions,
      );
      return;
    }

    let withdrawToastId: Id = 0;

    // if all is well
    try {
      // switch chain if necessary
      if (props?.chainId && props?.chainId !== provider.chain.id) {
        await switchChainAsync({ chainId: props?.chainId });
        return;
      }

      setIsLoading(true);
      setError('');

      withdrawToastId = toast.loading(
        `Submitted withdraw for ${normalized.normalized} ${symbol}`,
        {
          closeButton: true,
        },
      );

      // Claim of input amount
      setButton({ text: BUTTON_TEXTS.submitting, disabled: true });
      const prepareWithdraw = await simulateContract(provider, {
        account: address,
        address: props.pool,
        abi: ABI_LENDING_POOLS,
        functionName: 'claim',
        // Year, Month, Day, Amount, Address
        args: [BigInt(year.raw), BigInt(month.raw), BigInt(day.raw), address],
      });
      const withdrawHash = await signer?.writeContract(prepareWithdraw.request);
      ToastPromise(
        'withdraw',
        normalized,
        withdrawToastId,
        symbol,
        withdrawHash,
        undefined,
        chainId as IChainId,
      );

      // Success states
      setIsSuccess(true);
      setButton({ text: BUTTON_TEXTS.success, disabled: true });
      if (DEVELOPMENT_MODE) {
        console.log(
          '#requestWithdraw: successfully executed transaction',
          withdrawHash,
        );
      }

      // Refetch queries and log to google analytics
      queryClient.invalidateQueries();
      process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER
        ? sendGTMEvent({
            event: 'withdraw',
            pool: props.pool,
            chain: chainId,
            amount: normalized.normalized,
            symbol,
            hash: withdrawHash,
          })
        : console.warn('GOOGLE_TAG_MANAGER env var is not available');
      // await waitForTransactionReceipt(provider, { hash: withdrawHash as IAddress, confirmations: 1 })
    } catch (e) {
      console.error('#handleWithdraw:', e);
      toast.dismiss(withdrawToastId);
      if (String(e).toLowerCase().includes('user rejected')) {
        toast.warn('User rejected transaction');
        setButton({ text: BUTTON_TEXTS.submit, disabled: false });
      } else {
        toast.error('Error executing transaction');
        setButton({ text: BUTTON_TEXTS.error, disabled: true });
        SLACK.interactionError(
          String(e),
          props?.pool,
          String(props?.poolName),
          props?.chainId || chainId,
          address,
          'Withdraw',
        );
      }
      if (String(e).includes(':')) {
        const err = String(e)?.split(':')[0];
        if (err) setError(err);
      } else {
        setError('Error occured while executing transaction');
      }
    } finally {
      setIsLoading(false);
    }
  }

  async function simulate() {
    if (!props.value) {
      setExpected((_prev) => ({
        fee: toNormalizedBn(BigInt(0), decimals),
        out: toNormalizedBn(BigInt(0), decimals),
        loading: false,
      }));
      return;
    }
    if (!(provider && props.asset && props.pool && address)) return;
    const normalized = toNormalizedBn(props.value, decimals);

    if (props?.chainId === provider.chain.id) {
      const out = await readContract(provider, {
        account: address,
        address: props.pool,
        abi: ABI_LENDING_POOLS,
        functionName: 'previewRedeem',
        args: [BigInt(normalized.raw)],
      });

      // TODO: get actual transaction fee
      const fee = BigInt(200000);
      setExpected((_prev) => ({
        fee: toNormalizedBn(fee, decimals),
        out: toNormalizedBn(out, decimals),
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
    const val = toNormalizedBn(props.value || '0', decimals);
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

  useEffect(() => {
    if (props?.redemptions?.length) {
      setSelectedRedemption(props?.redemptions[0]);
    }
  }, [props?.redemptions?.length]);

  return {
    selectedRedemption,
    setSelectedRedemption,
    requestWithdraw,
    handleWithdraw,
    button,
    isLoading,
    error,
    isSuccess,
    expected,
    pool: {
      lockTime: toNormalizedBn(lockTime || 0, 0),
      loading: poolMetaLoading,
    },
  };
}
