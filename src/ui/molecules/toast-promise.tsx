import type { IAddress, INormalizedNumber } from '@augustdigital/sdk';
import type { Id } from 'react-toastify';
import { toast } from 'react-toastify';
import Toast from '../atoms/toast';
import type { IActions } from '../../utils/types';

export default function ToastPromise(
  type: IActions,
  normalized: INormalizedNumber,
  toastId: Id,
  symbol?: string,
  hash?: IAddress,
) {
  const determineWord = () => {
    switch (type) {
      case 'deposit': {
        if (hash) return 'deposited';
        return 'depositing';
      }
      case 'redeem': {
        if (hash) return 'redeemed';
        return 'redeeming';
      }
      case 'withdraw': {
        if (hash) return 'withdrew';
        return 'withdrawing';
      }
      default: {
        if (hash) return 'approved';
        return 'approving';
      }
    }
  };
  if (hash) {
    toast.update(toastId, {
      render(_props) {
        return (
          <Toast
            msg={`Successfully ${determineWord()} ${normalized.normalized} ${symbol}:`}
            hash={hash}
          />
        );
      },
      type: 'success',
      isLoading: false,
      closeButton: true,
      autoClose: 5000,
    });
  } else {
    toast.update(toastId, {
      render(_props) {
        return (
          <Toast
            msg={`Error ${determineWord()} ${normalized.normalized} ${symbol}:`}
            hash={hash}
          />
        );
      },
      type: 'error',
      isLoading: false,
      closeButton: true,
      autoClose: 5000,
    });
  }
}
