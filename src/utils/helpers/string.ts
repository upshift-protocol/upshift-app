export function truncate(s: string, amount?: number) {
  if (!s) return s;
  return `${s.slice(0, amount ?? 4)}...${s.slice(amount ? amount * -1 : -4)}`;
}

export function stringify(value: any) {
  if (value !== undefined) {
    return JSON.stringify(value, (_, v) =>
      typeof v === 'bigint' ? `${v}n` : v,
    );
  }
  return undefined;
}
