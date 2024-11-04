const title = 'Upshift | Democratizing Insitutional Lending';
const description =
  'Earn yields from real institutional loans via the Upshift protocol. Democratizing high-yield investments traditionally limited to financial institutions.';
const rootUrl = 'https://private.upshift.finance';

const appConfig = {
  site_name: 'Upshift',
  title,
  description,
  locale: 'en',
  canonical: rootUrl, // todo: change later
  openGraph: {
    url: rootUrl,
    title,
    description,
    images: [
      {
        url: `${rootUrl}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'Upshift',
        type: 'image/jpg',
      },
    ],
  },
  twitter: {
    handle: '@upshift_fi',
    site: '@upshift_fi',
    cardType: 'summary_large_image',
  },
};

export default appConfig;
