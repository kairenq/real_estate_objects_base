import React, { useState, useEffect } from 'react';
import { IconButton, CircularProgress } from '@mui/material';
import { Favorite, FavoriteBorder } from '@mui/icons-material';
import { favoritesAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

interface FavoriteButtonProps {
  realEstateId: number;
  onToggle?: () => void;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({ realEstateId, onToggle }) => {
  const { user } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      checkFavoriteStatus();
    }
  }, [realEstateId, user]);

  const checkFavoriteStatus = async () => {
    try {
      const response = await favoritesAPI.check(realEstateId);
      setIsFavorite(response.is_favorite);
    } catch (error) {
      console.error('Failed to check favorite status:', error);
    }
  };

  const handleToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (!user) return;

    setLoading(true);
    try {
      if (isFavorite) {
        await favoritesAPI.remove(realEstateId);
        setIsFavorite(false);
      } else {
        await favoritesAPI.add({ real_estate_id: realEstateId });
        setIsFavorite(true);
      }
      onToggle?.();
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <IconButton
      onClick={handleToggle}
      disabled={loading}
      sx={{
        color: isFavorite ? 'error.main' : 'action.active',
        '&:hover': {
          backgroundColor: isFavorite ? 'error.light' : 'action.hover',
        },
      }}
    >
      {loading ? (
        <CircularProgress size={24} />
      ) : isFavorite ? (
        <Favorite />
      ) : (
        <FavoriteBorder />
      )}
    </IconButton>
  );
};

export default FavoriteButton;
