// src/components/Dashboard.js
import React, { useEffect, useState } from 'react';
import { Box, Container, Grid, Paper, Typography, Fab, useMediaQuery } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import api from '../services/api';
import Sidebar from './Sidebar';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const [stats, setStats] = useState({});
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width:600px)');

  useEffect(() => {
    api.get('/reports/daily').then(res => setStats(res.data));
  }, []);

  const cards = [
    { title: 'Orders Today', value: stats.ordersToday || 0, color: '#1a3e72' },
    { title: 'Revenue', value: `${stats.revenueToday || 0} FCFA`, color: '#1976d2' },
    { title: 'Pending', value: stats.pendingToday || 0, color: '#388e3c' },
    { title: 'Low Stock', value: stats.lowStock?.length || 0, color: '#d32f2f' },
  ];

  return (
    <Box sx={{ display: 'flex', bgcolor: '#f4f6f8', minHeight: '100vh' }}>
      <Sidebar />
      <Container sx={{ mt: isMobile ? 8 : 4, mb: 8, ml: { xs: 0, sm: 'auto' } }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Typography variant="h4" sx={{ mb: 4, fontWeight: 700, color: '#1a3e72', textAlign: { xs: 'center', sm: 'left' } }}>
            Dashboard
          </Typography>
        </motion.div>

        <Grid container spacing={3}>
          {cards.map((card, i) => (
            <Grid item xs={12} sm={6} md={3} key={i}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <Paper
                  elevation={4}
                  sx={{
                    p: 3,
                    textAlign: 'center',
                    bgcolor: card.color,
                    color: 'white',
                    borderRadius: 3,
                    height: 140,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 500 }}>{card.title}</Typography>
                  <Typography variant="h3" sx={{ fontWeight: 'bold', mt: 1 }}>
                    {card.value}
                  </Typography>
                </Paper>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        <Fab
          color="primary"
          sx={{
            position: 'fixed',
            bottom: 32,
            right: 32,
            bgcolor: '#00bcd4',
            '&:hover': { bgcolor: '#0097a7' }
          }}
          onClick={() => navigate('/orders/new')}
        >
          <AddIcon />
        </Fab>
      </Container>
    </Box>
  );
}