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

const SLACK = {
  tokenError,
};

export default SLACK;
