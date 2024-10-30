import type { IAddress, INormalizedNumber } from '@augustdigital/sdk';
import type { Id } from 'react-toastify';
import { toast } from 'react-toastify';
import type { ReactNode } from 'react';
import { Fragment } from 'react';
import Toast from '../atoms/toast';
import type { IActions } from '../../utils/types';

const AUTOCLOSE_TIME = 5000; // 5 seconds

const DEFAULT_PROPS = (renderable: ReactNode) => ({
  isLoading: false,
  closeButton: true,
  autoClose: AUTOCLOSE_TIME,
  render(_props: unknown) {
    return <Fragment>{renderable}</Fragment>;
  },
});

/**
 *
 * @param type interaction type
 * @param normalized INormalizedNumber
 * @param toastId toast ID
 * @param symbol token symbol
 * @param hash transaction hash
 * @param step 0 | 1 | 2
 * 0: default (just clicked)
 * 1: write to contract (submitted)
 * 2: confirmed on blockchain (confirmed)
 * @returns
 */
export default function ToastPromise(
  type: IActions,
  normalized: INormalizedNumber,
  toastId: Id,
  symbol?: string,
  hash?: IAddress,
  step?: 0 | 1 | 2,
) {
  const stepWithFallback = step || 0;
  const determineWord = (): string => {
    switch (type) {
      case 'deposit': {
        if (hash) return 'deposited'; // past tense
        if (step) return 'deposit'; // thing
        return 'depositing'; // present tense participle
      }
      case 'redeem': {
        if (hash) return 'redeemed';
        if (step) return 'redemption';
        return 'redeeming';
      }
      case 'withdraw': {
        if (hash) return 'withdrew';
        if (step) return 'withdrawal';
        return 'withdrawing';
      }
      default: {
        if (hash) return 'approved';
        if (step) return 'approval';
        return 'approving';
      }
    }
  };
  if (hash) {
    switch (stepWithFallback) {
      case 2:
        return toast.update(toastId, {
          ...DEFAULT_PROPS(
            <Toast
              msg={`Confirmed ${determineWord()} ${normalized.normalized} ${symbol}:`}
              hash={hash}
            />,
          ),
          autoClose: false,
          isLoading: true,
          type: 'success',
        });
      case 1:
        return toast.update(toastId, {
          ...DEFAULT_PROPS(
            <Toast
              msg={`Submitted ${determineWord()} ${normalized.normalized} ${symbol}:`}
              hash={hash}
            />,
          ),
          autoClose: false,
          isLoading: true,
          type: 'success',
        });
      default:
        return toast.update(toastId, {
          ...DEFAULT_PROPS(
            <Toast
              msg={`Successfully ${determineWord()} ${normalized.normalized} ${symbol}:`}
              hash={hash}
            />,
          ),
          type: 'success',
        });
    }
  } else {
    return toast.update(toastId, {
      ...DEFAULT_PROPS(
        <Toast
          msg={`Error ${determineWord()} ${normalized.normalized} ${symbol}:`}
          hash={hash}
        />,
      ),
      type: 'error',
    });
  }
}
