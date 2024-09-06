import { queryClient } from '@/config/react-query';
import Toast from '@/ui/atoms/toast';
import { TIMES } from '@/utils/constants/time';
import { BUTTON_TEXTS } from '@/utils/constants/ui';
import type { IAddress, IChainId } from '@augustdigital/sdk';
import { ABI_LENDING_POOLS, toNormalizedBn } from '@augustdigital/sdk';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { erc20Abi } from 'viem';
import {
  readContract,
  simulateContract,
  waitForTransactionReceipt,
} from 'viem/actions';
import {
  useAccount,
  usePublicClient,
  useReadContract,
  useSwitchChain,
  useWalletClient,
} from 'wagmi';

type IUseDepositProps = {
  value?: string;
  asset?: IAddress;
  clearInput?: () => void;
  pool?: IAddress;
  closeModal?: () => void;
  chainId?: IChainId;
};

export default function useDeposit(props: IUseDepositProps) {
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

    if (BigInt(normalized.raw) === BigInt(0)) {
      console.error('#handleDeposit: amount input is zero');
      return;
    }

    try {
      if (props?.chainId && props?.chainId !== provider.chain.id) {
        await switchChainAsync({ chainId: props?.chainId });
        return;
      }

      setIsLoading(true);
      setError('');

      const allowance = await readContract(provider ?? signer, {
        address: props.asset,
        account: address,
        abi: erc20Abi,
        functionName: 'allowance',
        args: [address, props.pool],
      });
      if (BigInt(allowance) < BigInt(normalized.raw)) {
        // Approve input amount
        setButton({ text: BUTTON_TEXTS.approving, disabled: true });
        const approveHash = await signer?.writeContract({
          account: address,
          address: props.asset,
          abi: erc20Abi,
          functionName: 'approve',
          args: [props.pool, BigInt(normalized.raw)],
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
      }

      // Deposit input amount
      setButton({ text: BUTTON_TEXTS.submitting, disabled: true });
      const depositHash = await signer?.writeContract({
        account: address,
        address: props.pool,
        abi: ABI_LENDING_POOLS,
        functionName: 'deposit',
        args: [BigInt(normalized.raw), address],
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
      console.error(e);
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

    let approveReq;
    let out = BigInt(0);
    if (props?.chainId === provider.chain.id) {
      const { request: xapproveReq } = await simulateContract(provider, {
        account: address,
        address: props.asset,
        abi: erc20Abi,
        functionName: 'approve',
        args: [props.pool, BigInt(normalized.raw || 0)],
      });
      if (xapproveReq) approveReq = xapproveReq;

      const xout = await readContract(provider, {
        account: address,
        address: props.pool,
        abi: ABI_LENDING_POOLS,
        functionName: 'previewDeposit',
        args: [BigInt(normalized.raw)],
      });
      if (xout) out = xout;
    }

    // TODO: get actual transaction fee
    const fee = (approveReq?.gas || BigInt(2)) * BigInt(200000);
    setExpected((_prev) => ({
      fee: toNormalizedBn(fee, decimals),
      out: toNormalizedBn(out || BigInt(0), decimals),
      loading: false,
    }));
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
    (async () => {
      const val = toNormalizedBn(props.value || '0', decimals);
      if (BigInt(val.raw) === BigInt(0)) {
        setButton({ text: BUTTON_TEXTS.zero, disabled: true });
      } else {
        let allowance = BigInt(0);
        if (provider && address && props.asset && props.pool) {
          allowance = await readContract(provider, {
            address: props.asset,
            account: address,
            abi: erc20Abi,
            functionName: 'allowance',
            args: [address, props.pool],
          });
        }
        if (allowance < BigInt(val.raw)) {
          setButton({ text: BUTTON_TEXTS.approve, disabled: false });
        } else {
          setButton({ text: BUTTON_TEXTS.submit, disabled: false });
        }
        setError('');
      }
    })().catch(console.error);
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
    handleDeposit,
    button,
    isLoading,
    error,
    isSuccess,
    expected,
  };
}
