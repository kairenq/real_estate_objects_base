import React, { useEffect, useState } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  TextField,
  MenuItem,
  Chip,
  CircularProgress,
} from '@mui/material';
import { LocationOn, Home, AttachMoney } from '@mui/icons-material';
import { realEstateAPI } from '../services/api';
import type { RealEstateObject } from '../types';

const RealEstateList: React.FC = () => {
  const [objects, setObjects] = useState<RealEstateObject[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    city: '',
    property_type: '',
    min_price: '',
    max_price: '',
  });

  const propertyTypes = ['Квартира', 'Дом', 'Коммерческая'];

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

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Объекты недвижимости
      </Typography>

      {/* Фильтры */}
      <Box sx={{ mb: 4, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Город"
              name="city"
              value={filters.city}
              onChange={handleFilterChange}
              size="small"
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
              <MenuItem value="">Все</MenuItem>
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
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                fullWidth
                variant="contained"
                onClick={handleApplyFilters}
                size="small"
              >
                Применить
              </Button>
              <Button
                fullWidth
                variant="outlined"
                onClick={handleResetFilters}
                size="small"
              >
                Сбросить
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Список объектов */}
      {objects.length === 0 ? (
        <Typography variant="h6" align="center" color="text.secondary">
          Объекты не найдены
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {objects.map((obj) => (
            <Grid item xs={12} sm={6} md={4} key={obj.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" gutterBottom>
                    {obj.title}
                  </Typography>
                  <Chip
                    label={obj.property_type}
                    size="small"
                    icon={<Home />}
                    sx={{ mb: 1 }}
                  />
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {obj.description}
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                      <LocationOn fontSize="small" sx={{ mr: 0.5 }} />
                      {obj.city}, {obj.address}
                    </Typography>
                    <Typography variant="h6" color="primary" sx={{ display: 'flex', alignItems: 'center' }}>
                      <AttachMoney fontSize="small" />
                      {formatPrice(obj.price)}
                    </Typography>
                    {obj.area && (
                      <Typography variant="body2" color="text.secondary">
                        Площадь: {obj.area} м²
                      </Typography>
                    )}
                    {obj.rooms && (
                      <Typography variant="body2" color="text.secondary">
                        Комнат: {obj.rooms}
                      </Typography>
                    )}
                  </Box>
                </CardContent>
                <CardActions>
                  <Button size="small" color="primary">
                    Подробнее
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default RealEstateList;
