import React, { useEffect, useState } from 'react';
import { Container, Grid, Card, CardContent, CardMedia, Typography, Box, CircularProgress, IconButton, Paper } from '@mui/material';
import { Delete, Favorite as FavoriteIcon } from '@mui/icons-material';
import { favoritesAPI, realEstateAPI } from '../services/api';
import type { Favorite, RealEstateObject } from '../types';
import { useNavigate } from 'react-router-dom';

const Favorites: React.FC = () => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [objects, setObjects] = useState<Map<number, RealEstateObject>>(new Map());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const favs = await favoritesAPI.getAll();
      setFavorites(favs);

      // Загружаем полную информацию об объектах
      const allObjects = await realEstateAPI.getAll();
      const objectsMap = new Map(allObjects.map(obj => [obj.id, obj]));
      setObjects(objectsMap);
    } catch (error) {
      console.error('Failed to load favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (realEstateId: number) => {
    try {
      await favoritesAPI.remove(realEstateId);
      setFavorites(favorites.filter(f => f.real_estate_id !== realEstateId));
    } catch (error) {
      console.error('Failed to remove favorite:', error);
    }
  };

  const getPropertyImage = (propertyType: string) => {
    const images = {
      'Квартира': 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80',
      'Дом': 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80',
      'Коммерческая': 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80',
    };
    return images[propertyType as keyof typeof images] || images['Квартира'];
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
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <FavoriteIcon color="error" sx={{ fontSize: 40 }} />
        <Typography variant="h3" sx={{ fontWeight: 700 }}>
          Избранное
        </Typography>
      </Box>

      {favorites.length === 0 ? (
        <Paper sx={{ p: 8, textAlign: 'center', borderRadius: 3 }}>
          <FavoriteIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h5" color="text.secondary" gutterBottom>
            Пока нет избранных объектов
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Добавляйте понравившиеся объекты в избранное для быстрого доступа
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {favorites.map((fav) => {
            const obj = objects.get(fav.real_estate_id);
            if (!obj) return null;

            return (
              <Grid item xs={12} sm={6} md={4} lg={3} key={fav.id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ position: 'relative' }}>
                    <CardMedia
                      component="img"
                      height="200"
                      image={
                        obj.images && obj.images.length > 0
                          ? obj.images[0]
                          : getPropertyImage(obj.property_type)
                      }
                      alt={obj.title}
                      sx={{ cursor: 'pointer' }}
                      onClick={() => navigate('/catalog')}
                    />
                    <IconButton
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        bgcolor: 'background.paper',
                        '&:hover': { bgcolor: 'error.light' },
                      }}
                      onClick={() => handleRemove(obj.id)}
                    >
                      <Delete color="error" />
                    </IconButton>
                  </Box>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" gutterBottom>
                      {obj.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {obj.city}, {obj.address}
                    </Typography>
                    <Typography variant="h5" color="primary" sx={{ fontWeight: 700, mt: 2 }}>
                      {new Intl.NumberFormat('ru-RU', {
                        style: 'currency',
                        currency: 'RUB',
                        minimumFractionDigits: 0,
                      }).format(obj.price)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Container>
  );
};

export default Favorites;
