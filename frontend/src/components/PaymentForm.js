cat > src/components/PaymentForm.js <<'EOF'
import React, { useState, useEffect } from 'react';
import {
  TextField, Button, Container, Box, Typography, Paper, MenuItem, Alert
} from '@mui/material';
import api from '../services/api';
import Sidebar from './Sidebar';
import { useNavigate } from 'react-router-dom';

export default function PaymentForm() {
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState({ order_id: '', amount: '', method: 'Cash' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/orders').then(res => {
      const unpaid = res.data.filter(o => o.status !== 'Paid');
      setOrders(unpaid);
    });
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async () => {
    if (!form.order_id || !form.amount) {
      setError('Order and amount are required');
      return;
    }

    try {
      await api.post('/payments', {
        order_id: form.order_id,
        amount: parseInt(form.amount),
        method: form.method
      });
      navigate('/payments');
    } catch (e) {
      setError('Failed to save payment');
    }
  };

  return (
    <Box sx={{ display: 'flex', bgcolor: '#f4f6f8', minHeight: '100vh' }}>
      <Sidebar />
      <Container sx={{ mt: 4, maxWidth: 600 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, color: '#1a3e72' }}>
            Record Payment
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <TextField
            select label="Order" name="order_id" value={form.order_id}
            onChange={handleChange} fullWidth required sx={{ mb: 2 }}
          >
            {orders.map(o => (
              <MenuItem key={o.id} value={o.id}>
                #{o.id} – {o.customer_name} ({o.total_cost} FCFA)
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Amount (FCFA)" name="amount" type="number"
            value={form.amount} onChange={handleChange} fullWidth required sx={{ mb: 2 }}
          />

          <TextField
            select label="Payment Method" name="method" value={form.method}
            onChange={handleChange} fullWidth sx={{ mb: 3 }}
          >
            <MenuItem value="Cash">Cash</MenuItem>
            <MenuItem value="Mobile Money">Mobile Money</MenuItem>
            <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
          </TextField>

          <Button variant="contained" size="large" onClick={handleSubmit} fullWidth>
            Save Payment
          </Button>
        </Paper>
      </Container>
    </Box>
  );
}
EOF