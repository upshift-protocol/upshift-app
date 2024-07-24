import { queryClient } from '@/config/react-query';
import Toast from '@/ui/atoms/toast';
import { BUTTON_TEXTS } from '@/utils/constants';
import type { IAddress } from '@augustdigital/sdk';
import { ABI_LENDING_POOLS, toNormalizedBn } from '@augustdigital/sdk';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
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
  const { data: symbol } = useReadContract({
    address: props.asset,
    abi: erc20Abi,
    functionName: 'symbol',
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
    const normalized = toNormalizedBn(props.value, decimals);

    if (normalized.raw === BigInt(0)) {
      console.error('#handleDeposit: amount input is zero');
      return;
    }

    try {
      setIsLoading(true);
      setError('');

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
      await toast.promise(
        waitForTransactionReceipt(provider, { hash: approveHash! }),
        {
          success: {
            render: (
              <Toast
                msg={`Successfully approved ${normalized.normalized} ${symbol}:`}
                hash={approveHash!}
              />
            ),
            type: 'success',
          },
          error: `Error approving ${normalized.normalized} ${symbol}`,
          pending: `Submitted approval for ${normalized.normalized} ${symbol}`,
        },
      );

      // Deposit input amount
      setButton({ text: BUTTON_TEXTS.submitting, disabled: true });
      const depositHash = await signer?.writeContract({
        account: address,
        address: props.pool,
        abi: ABI_LENDING_POOLS,
        functionName: 'deposit',
        args: [normalized.raw, address],
      });
      await toast.promise(
        waitForTransactionReceipt(provider, { hash: depositHash! }),
        {
          success: {
            render: (
              <Toast
                msg={`Successfully deposited ${normalized.normalized} ${symbol}:`}
                hash={depositHash}
              />
            ),
            type: 'success',
          },
          error: `Error depositing ${normalized.normalized} ${symbol}`,
          pending: `Submitted deposit for ${normalized.normalized} ${symbol}`,
        },
      );

      // Refetch queries
      queryClient.refetchQueries();

      // Success states
      setIsSuccess(true);
      setButton({ text: BUTTON_TEXTS.success, disabled: true });
      console.log(
        '#handleDeposit: successfully executed transaction',
        depositHash,
      );
    } catch (e) {
      if (String(e).toLowerCase().includes('user rejected')) {
        toast.warn('User rejected transaction');
        setButton({ text: BUTTON_TEXTS.submit, disabled: false });
      } else {
        toast.error('Error executing transaction');
        setButton({ text: BUTTON_TEXTS.error, disabled: true });
      }
      console.error(e);
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
    const val = toNormalizedBn(props.value || '0', decimals);
    if (val.raw === BigInt(0)) {
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
