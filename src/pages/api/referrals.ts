// @ts-nocheck
import GSHEET from '@/utils/constants/google-credentials';
import type { IDepositLogData } from '@/utils/types';
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
    rows?.forEach((row, i) => {
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

interface ExtendedNextApiRequest extends NextApiRequest {
  body: IDepositLogData;
}

export default async function handler(
  req: ExtendedNextApiRequest,
  res: NextApiResponse,
) {
  try {
    switch (req.method?.toLowerCase()) {
      case 'post': {
        const rows = await getReferrals();
        return res.status(200).json({
          ok: true,
          data: rows,
          error: undefined,
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
