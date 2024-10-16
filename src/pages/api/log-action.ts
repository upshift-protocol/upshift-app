// @ts-nocheck
import { augustSdk } from '@/config/august-sdk';
import GSHEET from '@/utils/constants/google-credentials';
import { getChainNameById } from '@/utils/helpers/ui';
import type { IDepositLog, IDepositLogData } from '@/utils/types';
import type { IAddress } from '@augustdigital/sdk';
import { explorerLink, truncate } from '@augustdigital/sdk';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import type { NextApiRequest, NextApiResponse } from 'next';

const logDeposit = async (data: IDepositLog) => {
  try {
    // authenticate
    const auth = await GSHEET.getClient();
    const googleSheet = new GoogleSpreadsheet(GSHEET.id || '', auth);
    await googleSheet.loadInfo();
    // props
    const { eoa, token, chain, amount_native, amount_usd, tx_id, pool } = data;

    // prop sanitization
    if (!eoa) {
      console.error('#logDeposit: eoa is undefined');
      return;
    }
    if (!token) {
      console.error('#logDeposit: token is undefined');
      return;
    }
    if (!chain) {
      console.error('#logDeposit: chain is undefined');
      return;
    }
    if (!amount_native) {
      console.error('#logDeposit: amount_native is undefined');
      return;
    }
    if (!amount_usd) {
      console.error('#logDeposit: amount_usd is undefined');
      return;
    }
    if (!tx_id) {
      console.error('#logDeposit: tx_id is undefined');
      return;
    }
    if (!pool) {
      console.error('#logDeposit: pool is undefined');
      return;
    }

    // insert new row into google sheet
    console.log('#logDeposit::gsheet:', GSHEET.id, GSHEET.range);
    const googleSheetTab = googleSheet.sheetsByIndex[0];
    await googleSheetTab?.addRow({
      pool,
      eoa,
      token,
      amount_usd,
      amount_native,
      chain,
      tx_id,
    });
    return true;
  } catch (error) {
    console.error('#logDeposit:', error);
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
    const { body } = req;
    // log to google sheet
    const assetUsdPrice = await augustSdk.getPrice(body.token_symbol);
    const deposit = await logDeposit({
      ...body,
      chain: getChainNameById(body.chain),
      amount_usd: String(assetUsdPrice * Number(body.amount_native)),
      token: `=HYPERLINK("${explorerLink(body.token_address, body.chain, 'token')}", "${body.token_symbol || truncate(body.token_address)}")`,
      pool: `=HYPERLINK("${explorerLink(body.pool_address, body.chain, 'address')}", "${body.pool_name || truncate(body.pool_address)}")`,
      eoa: `=HYPERLINK("${explorerLink(body.eoa, body.chain, 'address')}", "${truncate(body.eoa)}")`,
      tx_id: `=HYPERLINK("${explorerLink(body.tx_id as IAddress, body.chain, 'tx')}", "${truncate(body.tx_id)}")`,
    });
    if (!deposit) {
      return res.status(500).json({
        ok: false,
        error: deposit,
        data: null,
      });
    }

    return res.status(200).json({
      ok: true,
      data: deposit,
      error: undefined,
    });
  } catch (e) {
    console.log('ERROR:', e);
    return res.status(500).json({
      ok: false,
      data: null,
      error: JSON.stringify(e),
    });
  }
}
