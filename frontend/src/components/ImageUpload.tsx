import React, { useState } from 'react';
import { Box, IconButton, Grid, Paper, Typography, Button, CircularProgress } from '@mui/material';
import { Delete, CloudUpload } from '@mui/icons-material';
import axios from 'axios';

interface ImageUploadProps {
  value: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ value = [], onChange, maxImages = 10 }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const remainingSlots = maxImages - value.length;
    if (remainingSlots <= 0) {
      setError(`Максимум ${maxImages} изображений`);
      return;
    }

    const filesToUpload = Array.from(files).slice(0, remainingSlots);

    // Validate file types and sizes
    const validFiles: File[] = [];
    for (const file of filesToUpload) {
      if (!file.type.startsWith('image/')) {
        setError('Можно загружать только изображения');
        continue;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('Размер файла не должен превышать 5 МБ');
        continue;
      }
      validFiles.push(file);
    }

    if (validFiles.length === 0) return;

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      validFiles.forEach(file => formData.append('files', file));

      const token = localStorage.getItem('token');
      const response = await axios.post<string[]>(
        `${import.meta.env.VITE_API_URL}/api/upload/images`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      onChange([...value, ...response.data]);
    } catch (err) {
      console.error('Upload failed:', err);
      setError('Ошибка загрузки изображений');
    } finally {
      setUploading(false);
      // Reset file input
      event.target.value = '';
    }
  };

  const handleDelete = async (imageUrl: string) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/upload/images`,
        {
          params: { image_url: imageUrl },
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      onChange(value.filter(url => url !== imageUrl));
    } catch (err) {
      console.error('Delete failed:', err);
      setError('Ошибка удаления изображения');
    }
  };

  return (
    <Box>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        {value.map((imageUrl) => (
          <Grid item xs={6} sm={4} md={3} key={imageUrl}>
            <Paper
              sx={{
                position: 'relative',
                paddingTop: '100%',
                overflow: 'hidden',
                borderRadius: 2,
              }}
            >
              <Box
                component="img"
                src={`${import.meta.env.VITE_API_URL}${imageUrl}`}
                alt="Preview"
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
              <IconButton
                size="small"
                sx={{
                  position: 'absolute',
                  top: 4,
                  right: 4,
                  bgcolor: 'background.paper',
                  '&:hover': { bgcolor: 'error.light', color: 'white' },
                }}
                onClick={() => handleDelete(imageUrl)}
              >
                <Delete fontSize="small" />
              </IconButton>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {value.length < maxImages && (
        <Box>
          <input
            accept="image/*"
            style={{ display: 'none' }}
            id="image-upload-input"
            type="file"
            multiple
            onChange={handleFileSelect}
            disabled={uploading}
          />
          <label htmlFor="image-upload-input">
            <Button
              variant="outlined"
              component="span"
              startIcon={uploading ? <CircularProgress size={20} /> : <CloudUpload />}
              disabled={uploading}
              fullWidth
            >
              {uploading ? 'Загрузка...' : 'Загрузить изображения'}
            </Button>
          </label>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
            Максимум {maxImages} изображений, до 5 МБ каждое
          </Typography>
        </Box>
      )}

      {error && (
        <Typography color="error" variant="caption" sx={{ display: 'block', mt: 1 }}>
          {error}
        </Typography>
      )}
    </Box>
  );
};

export default ImageUpload;
