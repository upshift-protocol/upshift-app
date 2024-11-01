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
import { erc20Abi } from 'viem';
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

type IUseStakeProps = {
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

export default function useStake(props: IUseStakeProps) {
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
  async function handleStake() {
    // checks
    if (!(address && provider && signer)) {
      console.warn('#handleStake: no wallet is connected');
      return;
    }
    if (!props.token) {
      console.warn('#handleStake: staking token address is undefined');
      return;
    }

    if (!props.value) {
      console.warn('#handleStake: amount input is undefined');
      return;
    }
    // convert to normalized
    const normalized = toNormalizedBn(props.value, props.decimals);
    if (BigInt(normalized.raw) === BigInt(0)) {
      console.warn('#handleStake: amount input is zero');
      return;
    }

    // unassigned vars
    let approvalToastId: Id = 0;
    let depositToastId: Id = 1;

    // functionality
    try {
      if (props?.chainId && props?.chainId !== provider.chain.id) {
        await switchChainAsync({ chainId: props?.chainId });
        return;
      }

      setIsLoading(true);
      setError('');

      const allowance = await readContract(provider ?? signer, {
        address: props.token,
        account: address,
        abi: erc20Abi,
        functionName: 'allowance',
        args: [address, props?.rewardDistributor as IAddress],
      });
      if (BigInt(allowance) < BigInt(normalized.raw)) {
        approvalToastId = toast.loading(
          `Submitted approval for ${normalized.normalized} ${props.symbol}`,
          {
            closeButton: true,
          },
        );
        // Approve input amount
        setButton({ text: BUTTON_TEXTS.approving, disabled: true });
        const prepareTx = await simulateContract(provider, {
          account: address,
          address: props.token,
          abi: erc20Abi,
          functionName: 'approve',
          args: [props.rewardDistributor as IAddress, BigInt(normalized.raw)],
        });
        const approveHash = await signer.writeContract(prepareTx.request);

        await waitForTransactionReceipt(provider, {
          hash: approveHash,
        });
        ToastPromise(
          'approve',
          normalized,
          approvalToastId,
          props.symbol,
          approveHash,
        );
      }

      // Deposit input amount
      setButton({ text: BUTTON_TEXTS.submitting, disabled: true });

      depositToastId = toast.loading(
        `Submitted deposit for ${normalized.normalized} ${props.symbol}`,
      );
      const prepareDeposit = await simulateContract(provider, {
        account: address,
        address: props.rewardDistributor as IAddress,
        abi: RewardDistributorABI,
        functionName: 'stake',
        args: [BigInt(normalized.raw)],
      });
      const depositHash = await signer.writeContract(prepareDeposit.request);

      await waitForTransactionReceipt(provider, {
        hash: depositHash,
      });

      ToastPromise(
        'deposit',
        normalized,
        depositToastId,
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
          '#handleStake: successfully executed transaction',
          depositHash,
        );
      }
    } catch (e) {
      console.error('#handleStake:', e);
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
      toast.dismiss(approvalToastId);
      setTimeout(() => {
        toast.dismiss(depositToastId);
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
      if (!(provider && props.token && props.rewardDistributor && address))
        return;
      const normalized = toNormalizedBn(props.value, props.decimals);

      const { request: approveReq } = await simulateContract(provider, {
        account: address,
        address: props.token,
        abi: erc20Abi,
        functionName: 'approve',
        args: [
          props.rewardDistributor as IAddress,
          BigInt(normalized.raw || 0),
        ],
      });

      const out = await readContract(provider, {
        account: address,
        address: props.rewardDistributor,
        abi: RewardDistributorABI,
        functionName: 'stake',
        args: [BigInt(normalized.raw)],
      });

      // TODO: get actual transaction fee
      const fee = (approveReq?.gas || BigInt(2)) * BigInt(200000);
      setExpected((_prev) => ({
        fee: toNormalizedBn(fee, props.decimals),
        out: toNormalizedBn((out as bigint) || BigInt(0), props.decimals),
        loading: false,
      }));
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
    (async () => {
      const val = toNormalizedBn(props.value || '0', props.decimals);
      if (BigInt(val.raw) === BigInt(0)) {
        setButton({ text: BUTTON_TEXTS.zero, disabled: true });
      } else {
        let allowance = BigInt(0);
        if (provider && address && props.token && props.rewardDistributor) {
          allowance = await readContract(provider, {
            address: props.token,
            account: address,
            abi: erc20Abi,
            functionName: 'allowance',
            args: [address, props.rewardDistributor],
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
    handleStake,
    button,
    isLoading,
    error,
    isSuccess,
    expected,
  };
}
