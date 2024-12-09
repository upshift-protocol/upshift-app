import { augustSdk } from '@/config/august-sdk';
import { queryClient } from '@/config/react-query';
import ToastPromise from '@/ui/molecules/toast-promise';
import { TIMES } from '@/utils/constants/time';
import {
  BUTTON_TEXTS,
  DEVELOPMENT_MODE,
  FALLBACK_CHAINID,
} from '@/utils/constants';
import { getChainNameById } from '@/utils/helpers/ui';
import SLACK from '@/utils/slack';
import type { IAddress, IChainId } from '@augustdigital/sdk';
import {
  ABI_LENDING_POOLS,
  explorerLink,
  toNormalizedBn,
  truncate,
} from '@augustdigital/sdk';
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
  useChainId,
  usePublicClient,
  useReadContract,
  useSwitchChain,
  useWalletClient,
} from 'wagmi';
import { sendGTMEvent } from '@next/third-parties/google';

type IUseDepositProps = {
  value?: string;
  asset?: IAddress;
  clearInput?: () => void;
  pool?: IAddress;
  poolName?: string;
  closeModal?: () => void;
  chainId?: IChainId;
  supplyCheck?: {
    maxSupply?: string;
    totalSupply: string;
  };
};

export default function useDeposit(props: IUseDepositProps) {
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
  const [isFull, setIsFull] = useState(false);
  const [button, setButton] = useState({
    text: BUTTON_TEXTS.zero,
    disabled: true,
  });

  // Meta hooks
  const provider = usePublicClient({ chainId: props?.chainId });
  const { data: signer } = useWalletClient({ chainId: props?.chainId });
  const { address } = useAccount();
  const { data: decimals } = useReadContract({
    address: props.asset,
    abi: erc20Abi,
    functionName: 'decimals',
    chainId: props?.chainId,
  });
  const { data: symbol } = useReadContract({
    address: props.asset,
    abi: erc20Abi,
    functionName: 'symbol',
    chainId: props?.chainId,
  });

  // Functions
  async function handleDeposit() {
    // checks
    if (!(address && provider && signer)) {
      console.warn('#handleDeposit: no wallet is connected');
      return;
    }
    if (!props.pool) {
      console.warn('#handleDeposit: pool address is undefined');
      return;
    }
    if (!props.asset) {
      console.warn('#handleDeposit: pool asset is undefined');
      return;
    }
    if (!props.value) {
      console.warn('#handleDeposit: amount input is undefined');
      return;
    }
    // convert to normalized
    const normalized = toNormalizedBn(props.value, decimals);
    if (BigInt(normalized.raw) === BigInt(0)) {
      console.warn('#handleDeposit: amount input is zero');
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
        address: props.asset,
        account: address,
        abi: erc20Abi,
        functionName: 'allowance',
        args: [address, props.pool],
      });
      if (BigInt(allowance) < BigInt(normalized.raw)) {
        approvalToastId = toast.loading(
          `Submitting approval for ${normalized.normalized} ${symbol}`,
          {
            closeButton: true,
          },
        );
        // Approve input amount
        setButton({ text: BUTTON_TEXTS.approving, disabled: true });
        const approveHash = await signer.writeContract({
          account: address,
          address: props.asset,
          abi: erc20Abi,
          functionName: 'approve',
          args: [props.pool, BigInt(normalized.raw)],
        });
        ToastPromise(
          'approve',
          normalized,
          approvalToastId,
          symbol,
          approveHash,
          1,
          chainId as IChainId,
        );
        const approveTxHash = await waitForTransactionReceipt(signer, {
          hash: approveHash,
        });
        ToastPromise(
          'approve',
          normalized,
          approvalToastId,
          symbol,
          approveTxHash.transactionHash,
          undefined,
          chainId as IChainId,
        );

        // log to google analytics
        process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER
          ? sendGTMEvent({
              event: 'approve',
              pool: props.pool,
              chain: chainId,
              amount: normalized.normalized,
              symbol,
              hash: approveHash,
            })
          : console.warn('GOOGLE_TAG_MANAGER env var is not available');

        // set button to deposit if not already
        setButton({ text: BUTTON_TEXTS.submit, disabled: false });
        setIsLoading(false);
        setError('');
      }

      // Deposit input amount
      setButton({ text: BUTTON_TEXTS.submitting, disabled: true });

      depositToastId = toast.loading(
        `Submitted deposit for ${normalized.normalized} ${symbol}`,
      );
      const prepareDeposit = await simulateContract(provider, {
        account: address,
        address: props.pool,
        abi: ABI_LENDING_POOLS,
        functionName: 'deposit',
        args: [BigInt(normalized.raw), address],
      });
      const depositHash = await signer.writeContract(prepareDeposit.request);
      ToastPromise(
        'deposit',
        normalized,
        depositToastId,
        symbol,
        depositHash,
        undefined,
        chainId as IChainId,
      );

      // Success states
      setIsSuccess(true);
      setButton({ text: BUTTON_TEXTS.success, disabled: true });
      if (DEVELOPMENT_MODE) {
        console.log(
          '#handleDeposit: successfully executed transaction',
          depositHash,
        );
      }

      // log to google sheet
      const assetUsdPrice = await augustSdk.getPrice(symbol || 'usdc');
      const formattedData = {
        chain: getChainNameById(props.chainId || FALLBACK_CHAINID),
        amount_native: normalized.normalized,
        amount_usd: String(assetUsdPrice * Number(normalized.normalized)),
        token: `=HYPERLINK("${explorerLink(props.asset, props.chainId || FALLBACK_CHAINID, 'token')}", "${symbol || truncate(props.asset)}")`,
        pool: `=HYPERLINK("${explorerLink(props.pool, props.chainId || FALLBACK_CHAINID, 'address')}", "${props.poolName || truncate(props.pool)}")`,
        eoa: `=HYPERLINK("${explorerLink(address, props.chainId || FALLBACK_CHAINID, 'address')}", "${truncate(address)}")`,
        tx_id: `=HYPERLINK("${explorerLink(depositHash as IAddress, props.chainId || FALLBACK_CHAINID, 'tx')}", "${truncate(depositHash || '')}")`,
      };
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_LAMBDA_URL}/logUpshiftDeposit`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
          body: JSON.stringify(formattedData),
        },
      );
      console.log('#handleDeposit::logDeposit:', res.status, res.statusText);

      // Refetch queries and log to google analytics
      queryClient.invalidateQueries();
      process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER
        ? sendGTMEvent({
            event: 'deposit',
            pool: props.pool,
            chain: chainId,
            amount: normalized.normalized,
            symbol,
            hash: depositHash,
          })
        : console.warn('GOOGLE_TAG_MANAGER env var is not available');
    } catch (e) {
      console.error('#handleDeposit:', e);
      toast.dismiss(depositToastId);
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
          'Deposit',
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

    const { request: approveReq } = await simulateContract(provider, {
      account: address,
      address: props.asset,
      abi: erc20Abi,
      functionName: 'approve',
      args: [props.pool, BigInt(normalized.raw || 0)],
    });

    const out = await readContract(provider, {
      account: address,
      address: props.pool,
      abi: ABI_LENDING_POOLS,
      functionName: 'previewDeposit',
      args: [BigInt(normalized.raw)],
    });

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

  // if supplyCheck is passed, check if totalSupply > maxSupply
  useEffect(() => {
    (async () => {
      if (props?.supplyCheck?.totalSupply) {
        const { totalSupply } = props.supplyCheck;
        let maxSupply: bigint;
        if (!props?.supplyCheck?.maxSupply) {
          if (provider && props?.pool) {
            maxSupply = await readContract(provider, {
              address: props.pool,
              abi: ABI_LENDING_POOLS,
              functionName: 'maxSupply',
              args: [],
            });
          } else {
            return;
          }
        } else {
          maxSupply = BigInt(props?.supplyCheck?.maxSupply);
        }
        // if(DEVELOPMENT_MODE) {
        //   console.log(
        //     `#supplyCheck::${props?.poolName}:`,
        //     `${totalSupply} >= ${maxSupply}`,
        //   );
        // }
        if (BigInt(totalSupply) + BigInt(1) >= BigInt(maxSupply)) {
          setIsFull(true);
          setButton({
            text: BUTTON_TEXTS.full,
            disabled: true,
          });
        }
      }
    })().catch(console.error);
  }, [props?.supplyCheck?.maxSupply, props?.supplyCheck?.totalSupply]);

  return {
    isFull,
    handleDeposit,
    button,
    isLoading,
    error,
    isSuccess,
    expected,
  };
}
