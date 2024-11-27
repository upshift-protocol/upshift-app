import { augustSdk } from '@/config/august-sdk';
import type { IAddress, IChainId, INormalizedNumber } from '@augustdigital/sdk';
import { explorerLink, truncate } from '@augustdigital/sdk';
import { getChainNameById } from './helpers/ui';
import { FALLBACK_CHAINID } from './constants/web3';

type ILogType = 'deposit' | 'withdraw' | 'request' | 'claim' | 'stake';

export function logToGSheet(
  type: ILogType | undefined,
  chainId: number | undefined,
  options: {
    symbol: string | undefined;
    value: INormalizedNumber | undefined;
    asset: string | undefined;
    eoa: string | undefined;
    hash: string | undefined;
    poolName: string | undefined;
    poolAddress: string | undefined;
  },
) {
  (async () => {
    if (!chainId) {
      console.error('#logToGSheet: chainId is undefined');
      return;
    }
    const assetUsdPrice = await augustSdk.getPrice(options.symbol || 'usdc');
    const formattedData = {
      chain: getChainNameById(chainId || FALLBACK_CHAINID),
      amount_native: options.value?.normalized,
      amount_usd: String(assetUsdPrice * Number(options.value?.normalized)),
      token: `=HYPERLINK("${explorerLink(options.asset as IAddress, (chainId || FALLBACK_CHAINID) as IChainId, 'token')}", "${options.symbol || truncate(options.asset || 'undefined')}")`,
      pool: `=HYPERLINK("${explorerLink(options.poolAddress as IAddress, (chainId || FALLBACK_CHAINID) as IChainId, 'address')}", "${options.poolName || truncate(options.poolAddress || 'undefined')}")`,
      eoa: `=HYPERLINK("${explorerLink(options.eoa as IAddress, (chainId || FALLBACK_CHAINID) as IChainId, 'address')}", "${truncate(options.eoa || 'undefined')}")`,
      tx_id: `=HYPERLINK("${explorerLink(options.hash as IAddress, (chainId || FALLBACK_CHAINID) as IChainId, 'tx')}", "${truncate(options.hash || '')}")`,
      type,
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
    console.log(`#logToGHSheet::${type}:`, res.status, res.statusText);
  })().catch((e) => console.error('#logToGSheet:', e));
}
