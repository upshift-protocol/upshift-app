// @ts-nocheck
import GSHEET from '@/utils/constants/google-credentials';
import type { INewReferralBody } from '@/utils/types';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import type { NextApiRequest, NextApiResponse } from 'next';

export interface IReferralRecord {
  eoa: string;
  referral: string;
  codeUsed: string;
  codes: string[];
}

const getReferrals = async () => {
  try {
    // authenticate
    const auth = await GSHEET.getClient();
    const googleSheet = new GoogleSpreadsheet(GSHEET.id || '', auth);
    await googleSheet.loadInfo();
    // insert new row into google sheet
    const googleSheetTab = googleSheet.sheetsByIndex[1];
    const rows = await googleSheetTab?.getRows();
    const formattedRows: IReferralRecord[] = [];
    rows?.forEach((row) => {
      const formattedObj: IReferralRecord = {};
      formattedObj.eoa = row.get('eoa');
      formattedObj.referral = row.get('referred_by_eoa');
      formattedObj.codeUsed = row.get('referral_code');
      formattedObj.codes = row.get('referral_codes')?.split(',');
      formattedRows.push(formattedObj);
    });
    console.log('#getReferrals::rows:', formattedRows);
    return formattedRows;
  } catch (error) {
    console.error('"#getReferrals::error:', error);
    return [];
  }
};

const newReferral = async (data: INewReferralBody) => {
  // sanitize
  let error: string;
  if (!data.address) {
    error = 'eoa is undefined';
    console.error('#newReferral:', error);
    return error;
  }
  if (!data.codeUsed) {
    error = 'codeUsed is undefined';
    console.error('#newReferral:', error);
    return error;
  }
  if (!data.newCode) {
    error = 'newCode is undefined';
    console.error('#newReferral:', error);
    return error;
  }

  // authenticate
  const auth = await GSHEET.getClient();
  const googleSheet = new GoogleSpreadsheet(GSHEET.id || '', auth);
  await googleSheet.loadInfo();
  const googleSheetTab = googleSheet.sheetsByIndex[1];

  await googleSheetTab?.addRow({
    eoa: data.address,
    referred_by_eoa: '',
    referral_code: data.codeUsed,
    referral_codes: data.newCode,
    amount_deposited: '',
  });

  console.log('#newReferral:', data);
  return data;
};

interface ExtendedNextApiRequest extends NextApiRequest {
  body: INewReferralBody;
}

export default async function handler(
  req: ExtendedNextApiRequest,
  res: NextApiResponse,
) {
  try {
    switch (req.method?.toLowerCase()) {
      case 'post': {
        const newReferralRes = await newReferral(JSON.parse(req?.body));
        if (typeof newReferralRes !== 'string') {
          return res.status(200).json({
            ok: true,
            data: newReferralRes,
            error: undefined,
          });
        }
        return res.status(500).json({
          ok: false,
          data: null,
          error: newReferralRes,
        });
      }
      default: {
        const rows = await getReferrals();
        return res.status(200).json({
          ok: true,
          data: rows,
          error: undefined,
        });
      }
    }
  } catch (e) {
    console.error('/api/referrals:', e);
    return res.status(500).json({
      ok: false,
      data: null,
      error: JSON.stringify(e),
    });
  }
}
