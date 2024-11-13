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

export function generateCode(seed: string, length = 12) {
  let result = '';
  const characters = seed;
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}
