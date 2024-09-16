const title = 'Upshift | Democratizing Insitutional Lending';
const description =
  'Earn yields from real institutional loans via the Upshift protocol. Democratizing high-yield investments traditionally limited to financial institutions.';
const rootUrl = 'https://app.upshift.finance';

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
        url: 'https://upshift.netlify.app/android-chrome-384x384.png',
        width: 384,
        height: 384,
        alt: 'Upshift',
        type: 'image/png',
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
