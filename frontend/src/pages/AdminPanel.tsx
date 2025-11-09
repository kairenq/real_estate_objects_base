import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Tabs,
  Tab,
  Paper,
  IconButton,
  Alert,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Delete } from '@mui/icons-material';
import { usersAPI, realEstateAPI } from '../services/api';
import type { User, RealEstateObject } from '../types';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
  return (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
};

const AdminPanel: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [users, setUsers] = useState<User[]>([]);
  const [objects, setObjects] = useState<RealEstateObject[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, [tabValue]);

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      if (tabValue === 0) {
        const usersData = await usersAPI.getAllUsers();
        setUsers(usersData);
      } else {
        const objectsData = await realEstateAPI.getAll();
        setObjects(objectsData);
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Ошибка загрузки данных');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (window.confirm('Вы уверены, что хотите удалить этого пользователя?')) {
      try {
        await usersAPI.deleteUser(userId);
        loadData();
      } catch (err: any) {
        setError(err.response?.data?.detail || 'Ошибка удаления пользователя');
      }
    }
  };

  const handleDeleteObject = async (objectId: number) => {
    if (window.confirm('Вы уверены, что хотите удалить этот объект?')) {
      try {
        await realEstateAPI.delete(objectId);
        loadData();
      } catch (err: any) {
        setError(err.response?.data?.detail || 'Ошибка удаления объекта');
      }
    }
  };

  const userColumns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'username', headerName: 'Имя пользователя', width: 150 },
    { field: 'email', headerName: 'Email', width: 200 },
    { field: 'full_name', headerName: 'Полное имя', width: 200 },
    {
      field: 'is_admin',
      headerName: 'Админ',
      width: 100,
      valueGetter: (params) => (params.value ? 'Да' : 'Нет'),
    },
    {
      field: 'is_active',
      headerName: 'Активен',
      width: 100,
      valueGetter: (params) => (params.value ? 'Да' : 'Нет'),
    },
    {
      field: 'actions',
      headerName: 'Действия',
      width: 100,
      sortable: false,
      renderCell: (params) => (
        <IconButton
          color="error"
          onClick={() => handleDeleteUser(params.row.id)}
          disabled={params.row.is_admin}
        >
          <Delete />
        </IconButton>
      ),
    },
  ];

  const objectColumns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'title', headerName: 'Название', width: 200 },
    { field: 'property_type', headerName: 'Тип', width: 120 },
    { field: 'city', headerName: 'Город', width: 120 },
    { field: 'address', headerName: 'Адрес', width: 200 },
    {
      field: 'price',
      headerName: 'Цена',
      width: 150,
      valueFormatter: (params) =>
        new Intl.NumberFormat('ru-RU', {
          style: 'currency',
          currency: 'RUB',
          minimumFractionDigits: 0,
        }).format(params.value),
    },
    { field: 'area', headerName: 'Площадь (м²)', width: 120 },
    { field: 'rooms', headerName: 'Комнат', width: 100 },
    {
      field: 'is_active',
      headerName: 'Активен',
      width: 100,
      valueGetter: (params) => (params.value ? 'Да' : 'Нет'),
    },
    {
      field: 'actions',
      headerName: 'Действия',
      width: 100,
      sortable: false,
      renderCell: (params) => (
        <IconButton
          color="error"
          onClick={() => handleDeleteObject(params.row.id)}
        >
          <Delete />
        </IconButton>
      ),
    },
  ];

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Панель администратора
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Paper sx={{ width: '100%' }}>
        <Tabs
          value={tabValue}
          onChange={(_, newValue) => setTabValue(newValue)}
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label="Пользователи" />
          <Tab label="Объекты недвижимости" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <Box sx={{ height: 600, width: '100%' }}>
            <DataGrid
              rows={users}
              columns={userColumns}
              loading={loading}
              pageSizeOptions={[10, 25, 50]}
              initialState={{
                pagination: {
                  paginationModel: { pageSize: 10 },
                },
              }}
              disableRowSelectionOnClick
            />
          </Box>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Box sx={{ height: 600, width: '100%' }}>
            <DataGrid
              rows={objects}
              columns={objectColumns}
              loading={loading}
              pageSizeOptions={[10, 25, 50]}
              initialState={{
                pagination: {
                  paginationModel: { pageSize: 10 },
                },
              }}
              disableRowSelectionOnClick
            />
          </Box>
        </TabPanel>
      </Paper>
    </Container>
  );
};

export default AdminPanel;
