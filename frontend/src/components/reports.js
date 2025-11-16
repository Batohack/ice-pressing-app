// src/components/Reports.js
import React, { useEffect, useState } from 'react';
import {
  Container, Typography, Box, Paper, Grid, Chip,
  Table, TableHead, TableBody, TableRow, TableCell
} from '@mui/material';
import api from '../services/api';
import Sidebar from './Sidebar';

export default function Reports() {
  const [daily, setDaily] = useState({});
  const [outstanding, setOutstanding] = useState([]);

  useEffect(() => {
    api.get('/reports/daily').then(res => setDaily(res.data));
    api.get('/reports/outstanding').then(res => setOutstanding(res.data));
  }, []);

  return (
    <Box sx={{ display: 'flex', bgcolor: '#f4f6f8', minHeight: '100vh' }}>
      <Sidebar />
      <Container sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, color: '#1a3e72' }}>
          Reports Dashboard
        </Typography>

        <Grid container spacing={3} sx={{ mb: 5 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={3} sx={{ p: 3, textAlign: 'center', bgcolor: '#1a3e72', color: 'white' }}>
              <Typography variant="h6">Orders Today</Typography>
              <Typography variant="h3" sx={{ fontWeight: 'bold' }}>{daily.ordersToday || 0}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={3} sx={{ p: 3, textAlign: 'center', bgcolor: '#1976d2', color: 'white' }}>
              <Typography variant="h6">Revenue</Typography>
              <Typography variant="h3" sx={{ fontWeight: 'bold' }}>{daily.revenueToday || 0} FCFA</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={3} sx={{ p: 3, textAlign: 'center', bgcolor: '#388e3c', color: 'white' }}>
              <Typography variant="h6">Pending</Typography>
              <Typography variant="h3" sx={{ fontWeight: 'bold' }}>{daily.pendingToday || 0}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={3} sx={{ p: 3, textAlign: 'center', bgcolor: '#d32f2f', color: 'white' }}>
              <Typography variant="h6">Low Stock</Typography>
              <Chip label={daily.lowStock?.length || 0} size="large" sx={{ bgcolor: 'white', color: '#d32f2f', fontWeight: 'bold' }} />
            </Paper>
          </Grid>
        </Grid>

        <Paper elevation={2} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ color: '#1a3e72', fontWeight: 600 }}>
            Outstanding Payments
          </Typography>
          {outstanding.length === 0 ? (
            <Typography color="success.main">All payments up to date!</Typography>
          ) : (
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: '#1a3e72' }}>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Order ID</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Customer</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Amount Due</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {outstanding.map(o => (
                  <TableRow key={o.id} hover>
                    <TableCell>#{o.id}</TableCell>
                    <TableCell>{o.customer_name}</TableCell>
                    <TableCell>
                      <Chip label={`${o.due} FCFA`} color="error" variant="outlined" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Paper>
      </Container>
    </Box>
  );
}