import type { IAddress, IChainId } from '@augustdigital/sdk';
import { explorerLink } from '@augustdigital/sdk';
import { getChainNameById } from './helpers/ui';

export function tokenError(
  symbol?: string,
  address?: string,
  chainId?: number,
) {
  const envVar = process.env.NEXT_PUBLIC_SLACK_WEBHOOK_LOGO_SECRET;
  if (!envVar) {
    console.error('#Slack.tokenError: env var is undefined');
    return;
  }
  if (!symbol) {
    console.error('#Slack.tokenError: symbol is undefined');
    return;
  }
  if (!address) {
    console.error('#Slack.tokenError: address is undefined');
    return;
  }
  if (!chainId) {
    console.error('#Slack.tokenError: chainId is undefined');
    return;
  }
  (async () => {
    const webhookUrl = `https://hooks.slack.com/services/${envVar}`;
    const data = {
      text: `*Missing Token Image*\n${new Date().toUTCString()}\n\nSymbol: ${symbol}\nAddress: ${address}\nChain: ${getChainNameById(chainId)}`,
    };

    const res = await fetch(webhookUrl, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (res?.status === 200)
      console.log('#Slack.tokenError: successfully sent');
    else console.error('#Slack.tokenError:', res.status, res.statusText);
  })().catch((e) => console.error('#Slack.tokenError:', e));
}

export function interactionError(
  error: string,
  poolAddress: string,
  poolName: string,
  chainId: number,
  address: string,
  type: 'Deposit' | 'Withdraw' | 'Request Redeem' | 'Withdraw',
) {
  const envVar = process.env.NEXT_PUBLIC_SLACK_WEBHOOK_INTERACTION_ERROR;
  if (!envVar) {
    console.error('#Slack.interactionError: env var is undefined');
    return;
  }
  if (!error) {
    console.error('#Slack.interactionError: error is undefined');
    return;
  }
  if (!poolAddress) {
    console.error('#Slack.interactionError: poolAddress is undefined');
    return;
  }
  if (!poolName) {
    console.error('#Slack.interactionError: poolName is undefined');
    return;
  }
  if (!type) {
    console.error('#Slack.interactionError: type is undefined');
    return;
  }
  if (!address) {
    console.error('#Slack.interactionError: address is undefined');
    return;
  }
  if (!chainId) {
    console.error('#Slack.interactionError: chainId is undefined');
    return;
  }
  (async () => {
    const webhookUrl = `https://hooks.slack.com/services/${envVar}`;
    const data = {
      text: `*${type} Error*\n${new Date().toUTCString()}\n\nPool: [${poolName}](${explorerLink(poolAddress as IAddress, chainId as IChainId, 'address')})\nEOA: ${address}\nChain: ${getChainNameById(chainId)}\n\nError: ${error}`,
    };

    const res = await fetch(webhookUrl, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (res?.status === 200)
      console.log('#Slack.interactionError: successfully sent');
    else console.error('#Slack.interactionError:', res.status, res.statusText);
  })().catch((e) => console.error('#Slack.interactionError:', e));
}

const SLACK = {
  tokenError,
  interactionError,
};

export default SLACK;
