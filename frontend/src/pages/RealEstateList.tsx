import React, { useEffect, useState } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  TextField,
  MenuItem,
  Chip,
  CircularProgress,
  Stack,
  Paper,
  Divider,
  useTheme,
  alpha,
  CardActionArea,
} from '@mui/material';
import {
  LocationOn,
  Home,
  SquareFoot,
  MeetingRoom,
  Layers,
  CalendarToday,
  Search,
  FilterList,
  Chat,
} from '@mui/icons-material';
import { realEstateAPI, messagesAPI } from '../services/api';
import type { RealEstateObject } from '../types';
import FavoriteButton from '../components/FavoriteButton';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const RealEstateList: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [objects, setObjects] = useState<RealEstateObject[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    city: '',
    property_type: '',
    min_price: '',
    max_price: '',
  });

  const propertyTypes = ['Квартира', 'Дом', 'Коммерческая'];

  // Placeholder изображения для разных типов недвижимости
  const getPropertyImage = (propertyType: string) => {
    const images = {
      'Квартира': 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80',
      'Дом': 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80',
      'Коммерческая': 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80',
    };
    return images[propertyType as keyof typeof images] || images['Квартира'];
  };

  useEffect(() => {
    loadObjects();
  }, []);

  const loadObjects = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (filters.city) params.city = filters.city;
      if (filters.property_type) params.property_type = filters.property_type;
      if (filters.min_price) params.min_price = parseFloat(filters.min_price);
      if (filters.max_price) params.max_price = parseFloat(filters.max_price);

      const data = await realEstateAPI.getAll(params);
      setObjects(data);
    } catch (error) {
      console.error('Failed to load objects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const handleApplyFilters = () => {
    loadObjects();
  };

  const handleResetFilters = () => {
    setFilters({
      city: '',
      property_type: '',
      min_price: '',
      max_price: '',
    });
    setTimeout(() => loadObjects(), 0);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleContactSeller = async (realEstateId: number) => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      await messagesAPI.createConversation({ real_estate_id: realEstateId });
      navigate('/messages');
    } catch (error) {
      console.error('Failed to create conversation:', error);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 8 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h3"
          gutterBottom
          sx={{
            fontWeight: 700,
            fontSize: { xs: '2rem', md: '3rem' },
          }}
        >
          Каталог недвижимости
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.1rem' }}>
          Найдено {objects.length} {objects.length === 1 ? 'объект' : 'объектов'}
        </Typography>
      </Box>

      {/* Фильтры */}
      <Paper
        elevation={0}
        sx={{
          mb: 4,
          p: 3,
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          borderRadius: 3,
          background: alpha(theme.palette.background.paper, 0.8),
          backdropFilter: 'blur(20px)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <FilterList sx={{ mr: 1, color: theme.palette.primary.main }} />
          <Typography variant="h6" fontWeight={600}>
            Фильтры поиска
          </Typography>
        </Box>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Город"
              name="city"
              value={filters.city}
              onChange={handleFilterChange}
              size="small"
              InputProps={{
                startAdornment: <LocationOn sx={{ mr: 1, color: 'action.active' }} />,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              select
              label="Тип недвижимости"
              name="property_type"
              value={filters.property_type}
              onChange={handleFilterChange}
              size="small"
            >
              <MenuItem value="">Все типы</MenuItem>
              {propertyTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <TextField
              fullWidth
              label="Мин. цена"
              name="min_price"
              type="number"
              value={filters.min_price}
              onChange={handleFilterChange}
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <TextField
              fullWidth
              label="Макс. цена"
              name="max_price"
              type="number"
              value={filters.max_price}
              onChange={handleFilterChange}
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={12} md={2}>
            <Stack direction="row" spacing={1}>
              <Button
                fullWidth
                variant="contained"
                onClick={handleApplyFilters}
                size="medium"
                startIcon={<Search />}
              >
                Найти
              </Button>
              <Button
                variant="outlined"
                onClick={handleResetFilters}
                size="medium"
              >
                Сброс
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Paper>

      {/* Список объектов */}
      {objects.length === 0 ? (
        <Paper
          sx={{
            p: 8,
            textAlign: 'center',
            borderRadius: 3,
          }}
        >
          <Home sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h5" color="text.secondary" gutterBottom>
            Объекты не найдены
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Попробуйте изменить параметры поиска
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {objects.map((obj) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={obj.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: theme.shadows[20],
                  },
                }}
              >
                <CardActionArea>
                  <CardMedia
                    component="img"
                    height="200"
                    image={
                      obj.images && obj.images.length > 0
                        ? obj.images[0]
                        : getPropertyImage(obj.property_type)
                    }
                    alt={obj.title}
                    sx={{
                      objectFit: 'cover',
                    }}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 16,
                      right: 16,
                      display: 'flex',
                      gap: 1,
                    }}
                  >
                    <Chip
                      label={obj.property_type}
                      size="small"
                      sx={{
                        bgcolor: alpha(theme.palette.background.paper, 0.95),
                        fontWeight: 600,
                        backdropFilter: 'blur(10px)',
                      }}
                    />
                  </Box>
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 8,
                      left: 8,
                    }}
                  >
                    <FavoriteButton realEstateId={obj.id} />
                  </Box>
                </CardActionArea>
                <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{
                      fontWeight: 700,
                      fontSize: '1.1rem',
                      mb: 1.5,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                    }}
                  >
                    {obj.title}
                  </Typography>

                  <Stack spacing={1} sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <LocationOn
                        fontSize="small"
                        sx={{ mr: 0.5, color: 'text.secondary', fontSize: '1.1rem' }}
                      />
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {obj.city}, {obj.address}
                      </Typography>
                    </Box>

                    {obj.area && (
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <SquareFoot
                          fontSize="small"
                          sx={{ mr: 0.5, color: 'text.secondary', fontSize: '1.1rem' }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          {obj.area} м²
                        </Typography>
                      </Box>
                    )}

                    {obj.rooms && (
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <MeetingRoom
                          fontSize="small"
                          sx={{ mr: 0.5, color: 'text.secondary', fontSize: '1.1rem' }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          {obj.rooms} {obj.rooms === 1 ? 'комната' : 'комнаты'}
                        </Typography>
                      </Box>
                    )}

                    {obj.floor && obj.total_floors && (
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Layers
                          fontSize="small"
                          sx={{ mr: 0.5, color: 'text.secondary', fontSize: '1.1rem' }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          {obj.floor} из {obj.total_floors} этажей
                        </Typography>
                      </Box>
                    )}
                  </Stack>

                  <Divider sx={{ my: 1.5 }} />

                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 700,
                        color: theme.palette.primary.main,
                        fontSize: '1.5rem',
                      }}
                    >
                      {formatPrice(obj.price)}
                    </Typography>
                    {obj.year_built && (
                      <Chip
                        icon={<CalendarToday sx={{ fontSize: '0.9rem' }} />}
                        label={obj.year_built}
                        size="small"
                        variant="outlined"
                      />
                    )}
                  </Box>

                  {user && obj.owner_id !== user.id && (
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<Chat />}
                      onClick={() => handleContactSeller(obj.id)}
                      sx={{ mt: 2 }}
                    >
                      Написать продавцу
                    </Button>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default RealEstateList;
