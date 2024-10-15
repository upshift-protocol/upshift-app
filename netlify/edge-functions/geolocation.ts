// @ts-nocheck
import type { Config, Context } from '@netlify/edge-functions';

const TERMS_URL = 'https://terms.upshift.finance';

export default async (_request: Request, context: Context) => {
  // block USA
  const country = context.geo.country?.code;
  if (country === 'US') return Response.redirect(TERMS_URL);
};

export const config: Config = {
  path: '/*',
};
