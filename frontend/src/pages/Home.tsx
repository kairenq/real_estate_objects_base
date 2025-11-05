import React, { useEffect, useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  useTheme,
  alpha,
  Stack,
} from '@mui/material';
import {
  TrendingUp,
  Security,
  Speed,
  HomeWork,
  Business,
  Apartment,
  ArrowForward,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { realEstateAPI } from '../services/api';

const Home: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [stats, setStats] = useState({
    totalObjects: 0,
    apartments: 0,
    houses: 0,
    commercial: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const objects = await realEstateAPI.getAll();
      setStats({
        totalObjects: objects.length,
        apartments: objects.filter((obj) => obj.property_type === 'Квартира').length,
        houses: objects.filter((obj) => obj.property_type === 'Дом').length,
        commercial: objects.filter((obj) => obj.property_type === 'Коммерческая').length,
      });
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const features = [
    {
      icon: <Speed sx={{ fontSize: 48 }} />,
      title: 'Быстрый поиск',
      description: 'Найдите идеальную недвижимость за минуты с нашими умными фильтрами',
    },
    {
      icon: <Security sx={{ fontSize: 48 }} />,
      title: 'Безопасность',
      description: 'Все данные защищены современными методами шифрования',
    },
    {
      icon: <TrendingUp sx={{ fontSize: 48 }} />,
      title: 'Актуальные цены',
      description: 'Регулярное обновление информации о ценах на рынке недвижимости',
    },
  ];

  const propertyTypes = [
    {
      icon: <Apartment sx={{ fontSize: 40 }} />,
      title: 'Квартиры',
      count: stats.apartments,
      color: theme.palette.primary.main,
    },
    {
      icon: <HomeWork sx={{ fontSize: 40 }} />,
      title: 'Дома',
      count: stats.houses,
      color: theme.palette.secondary.main,
    },
    {
      icon: <Business sx={{ fontSize: 40 }} />,
      title: 'Коммерческая',
      count: stats.commercial,
      color: theme.palette.info.main,
    },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
          color: 'white',
          py: { xs: 8, md: 12 },
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.1,
            backgroundImage:
              'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 80%, white 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }}
        />
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Box textAlign="center">
            <Typography
              variant="h1"
              gutterBottom
              sx={{
                fontSize: { xs: '2.5rem', md: '3.5rem', lg: '4.5rem' },
                fontWeight: 800,
                mb: 3,
                textShadow: '0 4px 20px rgba(0,0,0,0.2)',
              }}
            >
              Найдите дом своей мечты
            </Typography>
            <Typography
              variant="h5"
              sx={{
                mb: 5,
                fontSize: { xs: '1.1rem', md: '1.5rem' },
                fontWeight: 400,
                opacity: 0.95,
                maxWidth: 700,
                mx: 'auto',
              }}
            >
              Современная платформа для поиска и управления объектами недвижимости.
              Тысячи предложений в одном месте.
            </Typography>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              justifyContent="center"
            >
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate(isAuthenticated ? '/catalog' : '/register')}
                sx={{
                  bgcolor: 'white',
                  color: theme.palette.primary.main,
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                  '&:hover': {
                    bgcolor: alpha(theme.palette.common.white, 0.95),
                    transform: 'translateY(-2px)',
                    boxShadow: '0 12px 32px rgba(0,0,0,0.2)',
                  },
                  transition: 'all 0.3s ease',
                }}
                endIcon={<ArrowForward />}
              >
                {isAuthenticated ? 'Смотреть каталог' : 'Начать сейчас'}
              </Button>
              {!isAuthenticated && (
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate('/login')}
                  sx={{
                    color: 'white',
                    borderColor: 'white',
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    '&:hover': {
                      borderColor: 'white',
                      bgcolor: alpha(theme.palette.common.white, 0.1),
                      transform: 'translateY(-2px)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  Войти
                </Button>
              )}
            </Stack>
          </Box>
        </Container>
      </Box>

      {/* Stats Section */}
      <Container maxWidth="lg" sx={{ mt: -6, position: 'relative', zIndex: 2 }}>
        <Grid container spacing={3}>
          {propertyTypes.map((type, index) => (
            <Grid item xs={12} sm={4} key={index}>
              <Card
                sx={{
                  height: '100%',
                  textAlign: 'center',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: theme.shadows[12],
                  },
                }}
              >
                <CardContent sx={{ py: 4 }}>
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      bgcolor: alpha(type.color, 0.1),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 2,
                      color: type.color,
                    }}
                  >
                    {type.icon}
                  </Box>
                  <Typography variant="h3" fontWeight={700} color={type.color} gutterBottom>
                    {type.count}
                  </Typography>
                  <Typography variant="h6" color="text.secondary">
                    {type.title}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 10 }}>
        <Box textAlign="center" mb={8}>
          <Typography
            variant="h2"
            gutterBottom
            sx={{
              fontWeight: 700,
              fontSize: { xs: '2rem', md: '3rem' },
            }}
          >
            Почему выбирают нас
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
            Мы предоставляем лучший сервис для поиска и управления недвижимостью
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card
                sx={{
                  height: '100%',
                  textAlign: 'center',
                  transition: 'all 0.3s ease',
                  border: `2px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                  '&:hover': {
                    borderColor: theme.palette.primary.main,
                    transform: 'translateY(-8px)',
                  },
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Box
                    sx={{
                      color: theme.palette.primary.main,
                      mb: 2,
                    }}
                  >
                    {feature.icon}
                  </Box>
                  <Typography variant="h5" gutterBottom fontWeight={600}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA Section */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
          py: 10,
        }}
      >
        <Container maxWidth="md">
          <Box textAlign="center">
            <Typography
              variant="h3"
              gutterBottom
              sx={{
                fontWeight: 700,
                fontSize: { xs: '2rem', md: '2.5rem' },
              }}
            >
              Готовы начать?
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}
            >
              Присоединяйтесь к тысячам пользователей, которые уже нашли свой идеальный дом
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate(isAuthenticated ? '/catalog' : '/register')}
              sx={{
                px: 6,
                py: 2,
                fontSize: '1.1rem',
                fontWeight: 600,
                boxShadow: theme.shadows[8],
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: theme.shadows[16],
                },
                transition: 'all 0.3s ease',
              }}
              endIcon={<ArrowForward />}
            >
              {isAuthenticated ? 'Перейти к каталогу' : 'Зарегистрироваться бесплатно'}
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;
