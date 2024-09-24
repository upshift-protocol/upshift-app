export function buildQueryKey(
  unique: string,
  chainId?: number | string,
  address?: string,
) {
  const stringChain = String(chainId);
  const keys = [];
  if (unique) keys.push(unique);
  if (chainId) keys.push(stringChain);
  if (address) keys.push(address);
  return keys;
}
