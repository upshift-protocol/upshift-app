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
      weight: '400',
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
