// src/components/PaymentList.js
import React, { useEffect, useState } from 'react';
import {
  Table, TableHead, TableBody, TableRow, TableCell,
  Container, Typography, Box, Paper, Button, Fab
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import api from '../services/api';
import Sidebar from './Sidebar';
import { useNavigate } from 'react-router-dom';

export default function PaymentList() {
  const [payments, setPayments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/payments').then(res => setPayments(res.data));
  }, []);

  return (
    <Box sx={{ display: 'flex', bgcolor: '#f4f6f8', minHeight: '100vh' }}>
      <Sidebar />
      <Container sx={{ mt: 4, mb: 8 }}>
        <Paper elevation={2} sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 600, color: '#1a3e72' }}>Payments</Typography>
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/payments/new')}>
              Record Payment
            </Button>
          </Box>

          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: '#1a3e72' }}>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Order</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Customer</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Amount</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Method</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {payments.length === 0 ? (
                <TableRow><TableCell colSpan={5} align="center">No payments recorded</TableCell></TableRow>
              ) : (
                payments.map(p => (
                  <TableRow key={p.id} hover>
                    <TableCell>#{p.order_id}</TableCell>
                    <TableCell>{p.customer_name}</TableCell>
                    <TableCell>{p.amount} FCFA</TableCell>
                    <TableCell>{p.method}</TableCell>
                    <TableCell>{p.date}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Paper>

        <Fab color="primary" sx={{ position: 'fixed', bottom: 32, right: 32 }} onClick={() => navigate('/payments/new')}>
          <AddIcon />
        </Fab>
      </Container>
    </Box>
  );
}