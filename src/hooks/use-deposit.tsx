import { queryClient } from '@/config/react-query';
import { BUTTON_TEXTS } from '@/utils/constants';
import type { IAddress } from '@augustdigital/sdk';
import { ABI_LENDING_POOLS, toNormalizedBn } from '@augustdigital/sdk';
import { useEffect, useState } from 'react';
import { erc20Abi } from 'viem';
import { waitForTransactionReceipt } from 'viem/actions';
import {
  useAccount,
  usePublicClient,
  useReadContract,
  useWalletClient,
} from 'wagmi';

type IUseDepositProps = {
  value?: string;
  asset?: IAddress;
  clearInput?: () => void;
  pool?: IAddress;
  closeModal?: () => void;
};

export default function useDeposit(props: IUseDepositProps) {
  // States
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [button, setButton] = useState({
    text: BUTTON_TEXTS.zero,
    disabled: true,
  });

  // Meta hooks
  const provider = usePublicClient();
  const { data: signer } = useWalletClient();
  const { address } = useAccount();
  const { data: decimals } = useReadContract({
    address: props.asset,
    abi: erc20Abi,
    functionName: 'decimals',
  });

  // Functions
  async function handleDeposit() {
    if (!(address && provider)) {
      console.error('#handleDeposit: no wallet is connected');
      return;
    }
    if (!props.pool) {
      console.error('#handleDeposit: pool address is undefined');
      return;
    }
    if (!props.asset) {
      console.error('#handleDeposit: pool asset is undefined');
      return;
    }
    if (!props.value) {
      console.error('#handleDeposit: amount input is undefined');
      return;
    }
    if (BigInt(props.value) === BigInt(0)) {
      console.error('#handleDeposit: amount input is zero');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      const normalized = toNormalizedBn(props.value, decimals);

      // TODO: check if allowance already allows this amount
      // Approve input amount
      setButton({ text: BUTTON_TEXTS.approving, disabled: true });
      const approveHash = await signer?.writeContract({
        account: address,
        address: props.asset,
        abi: ABI_LENDING_POOLS,
        functionName: 'approve',
        args: [props.pool, normalized.raw],
      });
      await waitForTransactionReceipt(provider, { hash: approveHash! });

      // Deposit input amount
      setButton({ text: BUTTON_TEXTS.submitting, disabled: true });
      const depositHash = await signer?.writeContract({
        account: address,
        address: props.pool,
        abi: ABI_LENDING_POOLS,
        functionName: 'deposit',
        args: [normalized.raw, address],
      });
      await waitForTransactionReceipt(provider, { hash: depositHash! });

      // Refetch queries
      queryClient.refetchQueries();

      // Success states
      setIsSuccess(true);
      setButton({ text: BUTTON_TEXTS.success, disabled: true });
      console.log('#handleDeposit: successfully executed transaction');
    } catch (e) {
      console.error(e);
      setButton({ text: BUTTON_TEXTS.error, disabled: true });
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

  function reset() {
    props?.clearInput?.();
    setError('');
    setIsLoading(false);
    setIsSuccess(false);
    setButton({ text: BUTTON_TEXTS.zero, disabled: true });
  }

  // useEffects
  useEffect(() => {
    const val = BigInt(props.value || '0');
    if (val === BigInt(0)) {
      setButton({ text: BUTTON_TEXTS.zero, disabled: true });
    } else {
      setButton({ text: BUTTON_TEXTS.submit, disabled: false });
      setError('');
    }
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
    handleDeposit,
    button,
    isLoading,
    error,
    isSuccess,
  };
}
