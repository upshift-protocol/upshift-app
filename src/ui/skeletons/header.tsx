import dynamic from 'next/dynamic';

import { usePathname } from 'next/navigation';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';

import {
  INSTANCE,
  REFERRALS_ENABLED,
  STYLE_VARS,
  NAV_ITEMS,
} from '@/utils/constants';
import { useThemeMode } from '@/stores/theme';
import { Button, Drawer, IconButton, Skeleton } from '@mui/material';
import { useState } from 'react';
import Grid from '@mui/material/Grid';
import ThemeSwitch from '../atoms/theme-switch';
import LinkAtom from '../atoms/anchor-link';
import Logo from './Logo';
import MyReferralsModalMolecule from '../organisms/modal-my-referrals';

const IS_AVAX_OR_PRIVATE = () => {
  switch (INSTANCE) {
    case 'ethena':
    case 'lombard':
    case 'treehouse':
      return false;
    default:
      return true;
  }
};

const DynamicWalletBtn = dynamic(() => import('../molecules/connect-wallet'), {
  loading: () =>
    (
      <Skeleton
        width={'160px'}
        height={'42.5px'}
        style={{ margin: '0px', padding: '0px', marginInline: '0px' }}
      />
    ) as JSX.Element,
  ssr: false,
});

const DynamicChainBtn = dynamic(() => import('../molecules/chain-dropdown'), {
  loading: () =>
    (
      <Skeleton
        width={'66px'}
        height={'42.5px'}
        style={{ margin: '0px', padding: '0px', marginInline: '0px' }}
      />
    ) as JSX.Element,
  ssr: false,
});

const HeaderSkeleton = () => {
  const { isDark, toggleTheme } = useThemeMode();

  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  return (
    <header>
      <Box sx={{ flexGrow: 1, mb: '1rem' }}>
        <AppBar
          position="static"
          color={'inherit'}
          style={{
            backgroundColor: 'inherit',
            backgroundImage: 'none',
          }}
          sx={{ boxShadow: 'none', py: '0.25rem' }}
        >
          <Toolbar
            style={{
              maxWidth: STYLE_VARS.widthWide,
              margin: '0 auto',
              width: '100%',
              justifyContent: 'space-between',
            }}
          >
            {/* <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton> */}
            <Stack direction="row" alignItems="center" gap={2.5}>
              <LinkAtom
                href="/"
                target="_self"
                style={{
                  textDecoration: 'none',
                  color: 'inherit',
                  display: 'flex',
                  marginRight: '0.5rem',
                }}
                noSpan
              >
                <Logo />
              </LinkAtom>

              {IS_AVAX_OR_PRIVATE()
                ? NAV_ITEMS.map((n, i) => (
                    <Box
                      display={{ xs: 'none', sm: 'flex' }}
                      key={`desktop-nav-item-${i}`}
                    >
                      <LinkAtom href={n.link} target={n.target} noSpan>
                        <Button
                          variant="text"
                          color="info"
                          style={{
                            color: pathname === n.link ? '#00c260' : '',
                            borderColor: pathname === n.link ? '#00c260' : '',
                            fontSize: '18px',
                          }}
                        >
                          {n.text}
                        </Button>
                      </LinkAtom>
                    </Box>
                  ))
                : null}

              {REFERRALS_ENABLED && INSTANCE !== 'ethena' ? (
                <Box display={{ xs: 'none', sm: 'flex' }}>
                  <MyReferralsModalMolecule />
                </Box>
              ) : null}
            </Stack>

            {/* Desktop */}
            <Stack
              direction="row"
              alignItems="center"
              gap={{ xs: 1, md: 2 }}
              display={{ xs: 'none', sm: 'flex' }}
            >
              <ThemeSwitch checked={isDark} onChange={toggleTheme} />
              <DynamicChainBtn />
              <DynamicWalletBtn />
            </Stack>

            {/* Mobile */}
            <Stack
              direction="row"
              alignItems="center"
              gap={{ xs: 1, md: 2 }}
              display={{ sm: 'none' }}
            >
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={toggleDrawer(true)}
                sx={{ p: 1 }}
              >
                <svg
                  width={32}
                  height={32}
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M20.75 7C20.75 7.41421 20.4142 7.75 20 7.75L4 7.75C3.58579 7.75 3.25 7.41421 3.25 7C3.25 6.58579 3.58579 6.25 4 6.25L20 6.25C20.4142 6.25 20.75 6.58579 20.75 7Z"
                    fill="currentColor"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M20.75 12C20.75 12.4142 20.4142 12.75 20 12.75L4 12.75C3.58579 12.75 3.25 12.4142 3.25 12C3.25 11.5858 3.58579 11.25 4 11.25L20 11.25C20.4142 11.25 20.75 11.5858 20.75 12Z"
                    fill="currentColor"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M20.75 17C20.75 17.4142 20.4142 17.75 20 17.75L4 17.75C3.58579 17.75 3.25 17.4142 3.25 17C3.25 16.5858 3.58579 16.25 4 16.25L20 16.25C20.4142 16.25 20.75 16.5858 20.75 17Z"
                    fill="currentColor"
                  />
                </svg>
              </IconButton>
              <Drawer open={open} onClose={toggleDrawer(false)}>
                <Box
                  role="presentation"
                  // onClick={toggleDrawer(false)}
                  width="250px"
                  padding={2}
                  height="100%"
                >
                  <Stack gap={2} height="100%" justifyContent={'space-between'}>
                    <Stack gap={2}>
                      <Stack
                        direction="row"
                        alignItems={'center'}
                        gap={2}
                        justifyContent={'space-between'}
                      >
                        <Logo width={80} height={40} />
                        <IconButton
                          edge="start"
                          color="inherit"
                          aria-label="menu"
                          onClick={toggleDrawer(false)}
                          sx={{ p: 1 }}
                        >
                          <svg
                            width={20}
                            height={20}
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M20.7457 3.32851C20.3552 2.93798 19.722 2.93798 19.3315 3.32851L12.0371 10.6229L4.74275 3.32851C4.35223 2.93798 3.71906 2.93798 3.32854 3.32851C2.93801 3.71903 2.93801 4.3522 3.32854 4.74272L10.6229 12.0371L3.32856 19.3314C2.93803 19.722 2.93803 20.3551 3.32856 20.7457C3.71908 21.1362 4.35225 21.1362 4.74277 20.7457L12.0371 13.4513L19.3315 20.7457C19.722 21.1362 20.3552 21.1362 20.7457 20.7457C21.1362 20.3551 21.1362 19.722 20.7457 19.3315L13.4513 12.0371L20.7457 4.74272C21.1362 4.3522 21.1362 3.71903 20.7457 3.32851Z"
                              fill="currentColor"
                            />
                          </svg>
                        </IconButton>
                      </Stack>
                      {/* Mobile navigation */}
                      <Stack gap={2}>
                        {IS_AVAX_OR_PRIVATE()
                          ? NAV_ITEMS.map((n, i) => (
                              <LinkAtom
                                href={n.link}
                                target={n.target}
                                noSpan
                                key={`mobile-nav-item-${i}`}
                              >
                                <Button
                                  size="large"
                                  variant={
                                    pathname === n.link
                                      ? 'contained'
                                      : 'outlined'
                                  }
                                  color="primary"
                                  fullWidth
                                >
                                  {n.text}
                                </Button>
                              </LinkAtom>
                            ))
                          : null}
                        {REFERRALS_ENABLED ? (
                          <MyReferralsModalMolecule
                            buttonProps={{
                              size: 'large',
                              variant: 'outlined',
                              color: 'primary',
                              fullWidth: true,
                            }}
                          />
                        ) : null}
                      </Stack>
                    </Stack>
                    <Stack gap={2}>
                      <Grid
                        container
                        rowSpacing={1}
                        columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                      >
                        <Grid item xs={6}>
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleTheme();
                            }}
                            variant="outlined"
                            fullWidth
                            sx={{ height: '100%' }}
                          >
                            {isDark ? 'Light' : 'Dark'}
                          </Button>
                        </Grid>
                        <Grid item xs={6}>
                          <DynamicChainBtn />
                        </Grid>
                      </Grid>
                      <Box width="100%">
                        <DynamicWalletBtn btnFullWidth />
                      </Box>
                    </Stack>
                  </Stack>
                </Box>
              </Drawer>
            </Stack>
          </Toolbar>
        </AppBar>
      </Box>
    </header>
  );
};

export default HeaderSkeleton;
