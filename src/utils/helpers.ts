export function truncate(s: string, amount?: number) {
  if (!s) return s;
  return `${s.slice(0, amount ?? 4)}...${s.slice(amount ? amount * -1 : -4)}`;
}
