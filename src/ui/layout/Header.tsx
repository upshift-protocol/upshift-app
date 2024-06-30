import { AppBar, Box, Button, Stack, Toolbar, Typography } from '@mui/material';

import appConfig from '@/config/app';
import { STYLE_VARS } from '@/utils/constants';
import { useThemeMode } from '@/stores/theme';
import { ThemeSwitch } from '../components/theme-switch';

const Header = () => {
  const { isDark, toggleTheme } = useThemeMode();
  return (
  <header>
    <Box sx={{ flexGrow: 1, mb: '1rem' }}>
      <AppBar
        position="static"
        color="inherit"
        sx={{ boxShadow: 'none', py: '0.25rem' }}
      >
        <Toolbar
          style={{
            maxWidth: STYLE_VARS.widthWide,
            margin: '0 auto',
            width: '100%',
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
          <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
            {appConfig.site_name}
          </Typography>
          <Stack direction="row" alignItems="center" spacing={2}>
            <ThemeSwitch checked={isDark} onChange={toggleTheme} />
            <Button variant="outlined" color="inherit" size="large">
              Connect Wallet
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>
    </Box>
  </header>
)
}

export { Header };
