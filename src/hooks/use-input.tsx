import { type IAddress } from '@augustdigital/sdk';
import { useState } from 'react';
import { formatUnits } from 'viem';
import { useAccount, useBalance } from 'wagmi';

export default function useInput(token?: IAddress) {
  const { address } = useAccount();
  const { data } = useBalance({
    address,
    token,
  });

  const [value, setValue] = useState('');

  function handleMax(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.preventDefault();
    if (!token) {
      console.warn('#useInput: token address not passed');
    } else if (!data?.value) {
      console.warn('#useInput: no token balance');
      setValue('0');
    } else {
      setValue(formatUnits(data.value, data.decimals));
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
