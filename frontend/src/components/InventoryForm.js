import React, { useState } from 'react';
import { TextField, Button, Container, Box, Typography } from '@mui/material';
import api from '../services/api';
import Sidebar from './Sidebar';
import { useNavigate } from 'react-router-dom';

export default function InventoryForm() {
  const [form, setForm] = useState({ name: '', quantity: '', reorder_level: '' });
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    await api.post('/inventory', {
      name: form.name,
      quantity: parseInt(form.quantity),
      reorder_level: parseInt(form.reorder_level) || 0
    });
    navigate('/inventory');
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar />
      <Container sx={{ mt: 4 }}>
        <Typography variant="h5">Add Inventory Item</Typography>
        <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 400 }}>
          <TextField name="name" label="Item Name" value={form.name} onChange={handleChange} required />
          <TextField name="quantity" label="Quantity" type="number" value={form.quantity} onChange={handleChange} required />
          <TextField name="reorder_level" label="Reorder Level" type="number" value={form.reorder_level} onChange={handleChange} />
          <Button variant="contained" onClick={handleSubmit}>Save</Button>
        </Box>
      </Container>
    </Box>
  );
}
