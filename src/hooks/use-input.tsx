import type { IChainId, IAddress } from '@augustdigital/sdk';
import { useState } from 'react';
import { erc20Abi, formatUnits, zeroAddress } from 'viem';
import { useAccount, useReadContract } from 'wagmi';

export default function useInput(token?: IAddress, chainId?: IChainId) {
  const { address } = useAccount();

  const { data: balance } = useReadContract({
    address: token,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: [address || zeroAddress],
    chainId,
  });

  const { data: decimals } = useReadContract({
    address: token,
    abi: erc20Abi,
    functionName: 'decimals',
    chainId,
  });

  const [value, setValue] = useState('');

  function handleMax(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.preventDefault();
    if (!token) {
      console.warn('#handleMax: token address is undefined');
      setValue('0');
    } else if (balance && decimals) {
      setValue(formatUnits(balance, decimals));
    } else {
      console.warn('#handleMax: no token balance');
      setValue('0');
    }
  }

  function handleInput(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    setValue(e.target.value);
  }

  function clearInput() {
    setValue('');
  }

  return {
    value,
    handleInput,
    handleMax,
    clearInput,
  };
}
