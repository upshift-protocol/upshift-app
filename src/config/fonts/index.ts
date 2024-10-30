import localFont from 'next/font/local';

const dinCondensed = localFont({
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

const titlingGothic = localFont({
  src: [
    {
      path: './TitlingGothicFBSkylineMedium/font.woff',
      weight: '400',
    },
  ],
  variable: '--font-titling-gothic',
});

const visiaPro = localFont({
  src: [
    {
      path: './VisiaPro/VisiaProHeavy/font.woff',
      weight: '900',
    },
    {
      path: './VisiaPro/VisiaProExtraBold/font.woff',
      weight: '800',
    },
    {
      path: './VisiaPro/VisiaProBold/font.woff',
      weight: '700',
    },
    {
      path: './VisiaPro/VisiaProSemiBold/font.woff',
      weight: '600',
    },
    {
      path: './VisiaPro/VisiaProRegular/font.woff',
      weight: '400',
    },
    {
      path: './VisiaPro/VisiaProLight/font.woff',
      weight: '200',
    },
    {
      path: './VisiaPro/VisiaProExtraLight/font.woff',
      weight: '100',
    },
  ],
  variable: '--font-visia-pro',
});

const FONTS = {
  dinCondensed,
  titlingGothic,
  visiaPro,
};

export default FONTS;
