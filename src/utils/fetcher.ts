import type { IReferralRecord } from '@/pages/api/referrals';

type IFetchType = 'get-referrals' | 'log-deposits' | 'new-referral';

interface IReturnObj {
  status: number;
  data: null | IReferralRecord[];
  text: string;
}

export default async function fetchCustom(
  type: IFetchType,
  body?: Record<string, unknown>,
) {
  const returnObj: IReturnObj = {
    status: 500,
    data: null,
    text: '',
  };

  try {
    switch (type) {
      case 'log-deposits': {
        return returnObj;
      }
      case 'new-referral': {
        const referrals = await fetch(
          `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/api/referrals`,
          {
            method: 'POST',
            body: JSON.stringify(body),
          },
        );
        returnObj.status = referrals.status;
        returnObj.data = (
          (await referrals.json()) as { ok: Boolean; data: IReferralRecord[] }
        ).data;
        returnObj.text = referrals.statusText;
        return returnObj;
      }
      default: {
        const referrals = await fetch(
          `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/api/referrals`,
        );
        returnObj.status = referrals.status;
        returnObj.data = (
          (await referrals.json()) as { ok: Boolean; data: IReferralRecord[] }
        ).data;
        returnObj.text = referrals.statusText;
        return returnObj;
      }
    }
  } catch (e) {
    console.error(`#fetchCustom::${type}:`, e);
    returnObj.text = JSON.stringify(e);
    return returnObj;
  }
}
