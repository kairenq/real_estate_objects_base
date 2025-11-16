import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Box,
  Chip,
  Grid,
  Button,
  styled
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import HomeIcon from '@mui/icons-material/Home';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SquareFootIcon from '@mui/icons-material/SquareFoot';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import StairsIcon from '@mui/icons-material/Stairs';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { RealEstateObject } from '../types';
import { getPropertyImage } from '../utils/propertyImages';

interface PropertyDetailsModalProps {
  open: boolean;
  onClose: () => void;
  property: RealEstateObject;
}

const ImageGallery = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  height: '400px',
  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : '#f5f5f5',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
  borderRadius: '8px',
}));

const GalleryImage = styled('img')({
  maxWidth: '100%',
  maxHeight: '100%',
  width: '100%',
  height: '100%',
  objectFit: 'cover',
});

const NavigationButton = styled(IconButton)({
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 1)',
  },
});

const DetailItem = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  marginBottom: '12px',
});

export const PropertyDetailsModal: React.FC<PropertyDetailsModalProps> = ({
  open,
  onClose,
  property
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = property.images && property.images.length > 0
    ? property.images
    : [getPropertyImage(property.property_type)];

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      <DialogTitle sx={{ m: 0, p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Chip
            label={property.main_category}
            color="primary"
            size="small"
          />
          <Chip
            label={property.property_type}
            variant="outlined"
            size="small"
          />
        </Box>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        {/* Image Gallery */}
        <ImageGallery>
          <GalleryImage
            src={images[currentImageIndex]}
            alt={`${property.title} - ${currentImageIndex + 1}`}
          />
          {images.length > 1 && (
            <>
              <NavigationButton
                onClick={handlePrevImage}
                sx={{ left: 8 }}
              >
                <NavigateBeforeIcon />
              </NavigationButton>
              <NavigationButton
                onClick={handleNextImage}
                sx={{ right: 8 }}
              >
                <NavigateNextIcon />
              </NavigationButton>
              <Typography
                sx={{
                  position: 'absolute',
                  bottom: 16,
                  right: 16,
                  backgroundColor: 'rgba(0, 0, 0, 0.6)',
                  color: 'white',
                  padding: '4px 12px',
                  borderRadius: '16px',
                  fontSize: '14px',
                }}
              >
                {currentImageIndex + 1} / {images.length}
              </Typography>
            </>
          )}
        </ImageGallery>

        {/* Title */}
        <Typography variant="h5" sx={{ mt: 3, mb: 2, fontWeight: 600 }}>
          {property.title}
        </Typography>

        {/* Price */}
        <Typography variant="h4" color="primary" sx={{ mb: 3, fontWeight: 700 }}>
          {formatPrice(property.price)}
        </Typography>

        {/* Description */}
        {property.description && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
              Описание
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
              {property.description}
            </Typography>
          </Box>
        )}

        {/* Characteristics */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Характеристики
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <DetailItem>
                <HomeIcon color="action" />
                <Typography variant="body2">
                  <strong>Тип:</strong> {property.property_type}
                </Typography>
              </DetailItem>

              <DetailItem>
                <LocationOnIcon color="action" />
                <Typography variant="body2">
                  <strong>Город:</strong> {property.city}
                </Typography>
              </DetailItem>

              {property.area && (
                <DetailItem>
                  <SquareFootIcon color="action" />
                  <Typography variant="body2">
                    <strong>Площадь:</strong> {property.area} м²
                  </Typography>
                </DetailItem>
              )}

              {property.rooms && (
                <DetailItem>
                  <MeetingRoomIcon color="action" />
                  <Typography variant="body2">
                    <strong>Комнат:</strong> {property.rooms}
                  </Typography>
                </DetailItem>
              )}
            </Grid>

            <Grid item xs={12} sm={6}>
              {property.floor && (
                <DetailItem>
                  <StairsIcon color="action" />
                  <Typography variant="body2">
                    <strong>Этаж:</strong> {property.floor}
                    {property.total_floors ? ` из ${property.total_floors}` : ''}
                  </Typography>
                </DetailItem>
              )}

              {property.year_built && (
                <DetailItem>
                  <CalendarTodayIcon color="action" />
                  <Typography variant="body2">
                    <strong>Год постройки:</strong> {property.year_built}
                  </Typography>
                </DetailItem>
              )}

              <DetailItem>
                <AttachMoneyIcon color="action" />
                <Typography variant="body2">
                  <strong>Цена за м²:</strong>{' '}
                  {property.area
                    ? formatPrice(Math.round(property.price / property.area))
                    : 'Н/Д'
                  }
                </Typography>
              </DetailItem>
            </Grid>
          </Grid>
        </Box>

        {/* Address */}
        <Box
          sx={{
            mb: 2,
            p: 2,
            backgroundColor: (theme) =>
              theme.palette.mode === 'dark'
                ? 'rgba(255, 255, 255, 0.05)'
                : 'rgba(0, 0, 0, 0.03)',
            borderRadius: 1,
            border: (theme) => `1px solid ${
              theme.palette.mode === 'dark'
                ? 'rgba(255, 255, 255, 0.1)'
                : 'rgba(0, 0, 0, 0.08)'
            }`
          }}
        >
          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
            <strong>Адрес:</strong>
          </Typography>
          <Typography variant="body1">
            {property.city}, {property.address}
          </Typography>
        </Box>

        {/* Contact Button */}
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
          <Button
            variant="contained"
            size="large"
            fullWidth
            sx={{ maxWidth: 400 }}
          >
            Связаться с продавцом
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};
