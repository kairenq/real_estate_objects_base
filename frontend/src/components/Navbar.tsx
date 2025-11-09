import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Container,
  Avatar,
  Divider,
  useTheme,
  alpha,
} from '@mui/material';
import {
  AdminPanelSettings,
  Brightness4,
  Brightness7,
  HomeWork,
  Logout,
  Business,
  Dashboard,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useThemeMode } from '../context/ThemeContext';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { user, logout, isAdmin } = useAuth();
  const { isDarkMode, toggleTheme } = useThemeMode();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleClose();
    navigate('/login');
  };

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        background: isDarkMode
          ? `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`
          : `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
        backdropFilter: 'blur(20px)',
        borderBottom: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <HomeWork sx={{ mr: 1.5, fontSize: 32 }} />
          <Typography
            variant="h6"
            component="div"
            sx={{
              flexGrow: 1,
              fontWeight: 700,
              background: 'linear-gradient(45deg, #fff 30%, rgba(255,255,255,0.8) 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              cursor: 'pointer',
            }}
            onClick={() => navigate('/')}
          >
            База Недвижимости
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {user && (
              <>
                <Button
                  color="inherit"
                  onClick={() => navigate('/catalog')}
                  startIcon={<Business />}
                  sx={{
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.common.white, 0.1),
                    },
                  }}
                >
                  Каталог
                </Button>
                <Button
                  color="inherit"
                  onClick={() => navigate('/my-objects')}
                  startIcon={<Dashboard />}
                  sx={{
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.common.white, 0.1),
                    },
                  }}
                >
                  Мои объекты
                </Button>
                {isAdmin && (
                  <Button
                    color="inherit"
                    onClick={() => navigate('/admin')}
                    startIcon={<AdminPanelSettings />}
                    sx={{
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.common.white, 0.1),
                      },
                    }}
                  >
                    Админ
                  </Button>
                )}
              </>
            )}

            <IconButton
              onClick={toggleTheme}
              color="inherit"
              sx={{
                '&:hover': {
                  backgroundColor: alpha(theme.palette.common.white, 0.1),
                },
              }}
            >
              {isDarkMode ? <Brightness7 /> : <Brightness4 />}
            </IconButton>

            {user ? (
              <Box>
                <IconButton
                  size="large"
                  onClick={handleMenu}
                  sx={{
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.common.white, 0.1),
                    },
                  }}
                >
                  <Avatar
                    sx={{
                      width: 36,
                      height: 36,
                      bgcolor: theme.palette.secondary.main,
                      fontSize: '1rem',
                      fontWeight: 700,
                    }}
                  >
                    {user.username[0].toUpperCase()}
                  </Avatar>
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                  PaperProps={{
                    elevation: 8,
                    sx: {
                      mt: 1.5,
                      minWidth: 220,
                      borderRadius: 2,
                    },
                  }}
                >
                  <Box sx={{ px: 2, py: 1.5 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Вы вошли как
                    </Typography>
                    <Typography variant="body1" fontWeight={600}>
                      {user.username}
                    </Typography>
                    {isAdmin && (
                      <Typography variant="caption" color="primary">
                        Администратор
                      </Typography>
                    )}
                  </Box>
                  <Divider />
                  <MenuItem
                    onClick={() => {
                      handleClose();
                      navigate('/my-objects');
                    }}
                  >
                    <Dashboard sx={{ mr: 1.5 }} />
                    Мои объекты
                  </MenuItem>
                  <Divider />
                  <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                    <Logout sx={{ mr: 1.5 }} />
                    Выйти
                  </MenuItem>
                </Menu>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  color="inherit"
                  onClick={() => navigate('/login')}
                  sx={{
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.common.white, 0.1),
                    },
                  }}
                >
                  Вход
                </Button>
                <Button
                  variant="contained"
                  onClick={() => navigate('/register')}
                  sx={{
                    bgcolor: 'white',
                    color: theme.palette.primary.main,
                    '&:hover': {
                      bgcolor: alpha(theme.palette.common.white, 0.9),
                    },
                  }}
                >
                  Регистрация
                </Button>
              </Box>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
