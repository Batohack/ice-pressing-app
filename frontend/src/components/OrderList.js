// src/components/Dashboard.js
import React, { useEffect, useState } from 'react';
import { Box, Container, Grid, Paper, Typography, Fab, CircularProgress } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import api from '../services/api';
import Sidebar from './Sidebar';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/reports/daily').then(res => {
      setStats(res.data);
      setLoading(false);
    });
  }, []);

  if (loading) return <CircularProgress sx={{ display: 'block', mx: 'auto', mt: 10 }} />;

  return (
    <Box sx={{ overflowX: 'auto', bgcolor: 'white', borderRadius: 2, boxShadow: 1 }}>
      <Sidebar />
      <Container sx={{ mt: 4, mb: 8 }}>
        <Typography variant="h4" sx={{ mb: 4, fontWeight: 700, color: '#1a3e72' }}>
          Dashboard
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={3} sx={{ p: 3, textAlign: 'center', bgcolor: '#1a3e72', color: 'white' }}>
              <Typography variant="h6">Orders Today</Typography>
              <Typography variant="h3">{stats.ordersToday || 0}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={3} sx={{ p: 3, textAlign: 'center', bgcolor: '#1976d2', color: 'white' }}>
              <Typography variant="h6">Revenue</Typography>
              <Typography variant="h3">{stats.revenueToday || 0} FCFA</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={3} sx={{ p: 3, textAlign: 'center', bgcolor: '#388e3c', color: 'white' }}>
              <Typography variant="h6">Pending</Typography>
              <Typography variant="h3">{stats.pendingToday || 0}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={3} sx={{ p: 3, textAlign: 'center', bgcolor: '#d32f2f', color: 'white' }}>
              <Typography variant="h6">Low Stock</Typography>
              <Typography variant="h3">{stats.lowStock?.length || 0}</Typography>
            </Paper>
          </Grid>
        </Grid>

        <Fab
          color="primary"
          sx={{ position: 'fixed', bottom: 32, right: 32 }}
          onClick={() => navigate('/orders/new')}
        >
          <AddIcon />
        </Fab>
      </Container>
    </Box>
  );
}