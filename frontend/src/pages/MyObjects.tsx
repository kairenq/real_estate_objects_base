import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  MenuItem,
  Card,
  CardContent,
  Chip,
  IconButton,
  Alert,
} from '@mui/material';
import { Add, Edit, Delete, LocationOn, Home, AttachMoney } from '@mui/icons-material';
import { realEstateAPI } from '../services/api';
import type { RealEstateObject, CreateRealEstateRequest } from '../types';
import ImageUpload from '../components/ImageUpload';

const MyObjects: React.FC = () => {
  const [objects, setObjects] = useState<RealEstateObject[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingObject, setEditingObject] = useState<RealEstateObject | null>(null);
  const [formData, setFormData] = useState<CreateRealEstateRequest>({
    title: '',
    description: '',
    main_category: 'Жилая',
    property_type: 'Квартира',
    address: '',
    city: '',
    price: 0,
    area: 0,
    rooms: 0,
    floor: 0,
    total_floors: 0,
    year_built: new Date().getFullYear(),
    images: [],
  });
  const [error, setError] = useState('');

  const mainCategories = ['Жилая', 'Коммерческая'];

  // Динамически определяем типы недвижимости в зависимости от главной категории
  const getPropertyTypes = () => {
    if (formData.main_category === 'Жилая') {
      return ['Квартира', 'Дом'];
    } else if (formData.main_category === 'Коммерческая') {
      return ['Офис', 'Торговая площадь'];
    }
    return ['Квартира', 'Дом'];
  };

  useEffect(() => {
    loadMyObjects();
  }, []);

  const loadMyObjects = async () => {
    try {
      const data = await realEstateAPI.getMyObjects();
      setObjects(data);
    } catch (error) {
      console.error('Failed to load objects:', error);
    }
  };

  const handleOpenDialog = (obj?: RealEstateObject) => {
    if (obj) {
      setEditingObject(obj);
      setFormData({
        title: obj.title,
        description: obj.description || '',
        main_category: obj.main_category,
        property_type: obj.property_type,
        address: obj.address,
        city: obj.city,
        price: obj.price,
        area: obj.area,
        rooms: obj.rooms,
        floor: obj.floor,
        total_floors: obj.total_floors,
        year_built: obj.year_built,
        images: obj.images || [],
      });
    } else {
      setEditingObject(null);
      setFormData({
        title: '',
        description: '',
        main_category: 'Жилая',
        property_type: 'Квартира',
        address: '',
        city: '',
        price: 0,
        area: 0,
        rooms: 0,
        floor: 0,
        total_floors: 0,
        year_built: new Date().getFullYear(),
        images: [],
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingObject(null);
    setError('');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.type === 'number' ? parseFloat(e.target.value) : e.target.value;
    const newFormData: any = {
      ...formData,
      [e.target.name]: value,
    };

    // Если изменилась главная категория, сбрасываем тип недвижимости
    if (e.target.name === 'main_category') {
      if (value === 'Жилая') {
        newFormData.property_type = 'Квартира';
      } else if (value === 'Коммерческая') {
        newFormData.property_type = 'Офис';
      }
    }

    setFormData(newFormData);
  };

  const handleSubmit = async () => {
    try {
      if (editingObject) {
        await realEstateAPI.update(editingObject.id, formData);
      } else {
        await realEstateAPI.create(formData);
      }
      handleCloseDialog();
      loadMyObjects();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Ошибка сохранения объекта');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Вы уверены, что хотите удалить этот объект?')) {
      try {
        await realEstateAPI.delete(id);
        loadMyObjects();
      } catch (error) {
        console.error('Failed to delete object:', error);
      }
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          Мои объекты
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
        >
          Добавить объект
        </Button>
      </Box>

      {objects.length === 0 ? (
        <Typography variant="h6" align="center" color="text.secondary">
          У вас пока нет объектов
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {objects.map((obj) => (
            <Grid item xs={12} sm={6} md={4} key={obj.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <Typography variant="h6" gutterBottom>
                      {obj.title}
                    </Typography>
                    <Box>
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDialog(obj)}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDelete(obj.id)}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                  <Box sx={{ mb: 1, display: 'flex', gap: 0.5 }}>
                    <Chip
                      label={obj.main_category}
                      size="small"
                      color="primary"
                    />
                    <Chip
                      label={obj.property_type}
                      size="small"
                      icon={<Home />}
                      variant="outlined"
                    />
                  </Box>
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
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Диалог создания/редактирования */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingObject ? 'Редактировать объект' : 'Добавить объект'}
        </DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Название"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Описание"
                name="description"
                value={formData.description}
                onChange={handleChange}
                multiline
                rows={3}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Категория"
                name="main_category"
                value={formData.main_category}
                onChange={handleChange}
                required
              >
                {mainCategories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Тип недвижимости"
                name="property_type"
                value={formData.property_type}
                onChange={handleChange}
                required
              >
                {getPropertyTypes().map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Город"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Адрес"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Цена"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Площадь (м²)"
                name="area"
                type="number"
                value={formData.area}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Комнат"
                name="rooms"
                type="number"
                value={formData.rooms}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Этаж"
                name="floor"
                type="number"
                value={formData.floor}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Всего этажей"
                name="total_floors"
                type="number"
                value={formData.total_floors}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Год постройки"
                name="year_built"
                type="number"
                value={formData.year_built}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                Изображения
              </Typography>
              <ImageUpload
                value={formData.images || []}
                onChange={(images) => setFormData({ ...formData, images })}
                maxImages={10}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Отмена</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingObject ? 'Сохранить' : 'Создать'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default MyObjects;
