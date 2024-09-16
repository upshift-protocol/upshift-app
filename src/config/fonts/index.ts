import localFont from 'next/font/local';

export const dinCondensed = localFont({
  src: [
    {
      path: './DinCondensedDINCondensedLight/font.woff',
      weight: '300',
    },
    {
      path: './DinCondensedDINCondensedRegular/font.woff',
      weight: '400',
    },
  ],
  variable: '--font-din-condensed',
});

export const titlingGothic = localFont({
  src: [
    {
      path: './TitlingGothicFBSkylineMedium/font.woff',
      weight: '400',
    },
  ],
  variable: '--font-titling-gothic',
});
