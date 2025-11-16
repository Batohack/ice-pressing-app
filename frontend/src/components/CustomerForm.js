// src/components/CustomerForm.js
import React, { useState, useEffect } from 'react';
import {
  TextField, Button, Container, Box, Typography, Paper, Alert
} from '@mui/material';
import api from '../services/api';
import Sidebar from './Sidebar';
import { useNavigate, useParams } from 'react-router-dom';

export default function CustomerForm() {
  const { id } = useParams();
  const isEdit = !!id;
  const [form, setForm] = useState({ name: '', phone: '', address: '', email: '' });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    if (isEdit) {
      api.get(`/customers/${id}`).then(res => setForm(res.data));
    }
  }, [id, isEdit]);

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.phone.trim()) newErrors.phone = 'Phone is required';
    else if (!/^\d{9,12}$/.test(form.phone.replace(/\s/g, ''))) newErrors.phone = 'Invalid phone (9–12 digits)';
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = 'Invalid email';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' }); // Clear error on change
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      if (isEdit) {
        await api.put(`/customers/${id}`, form);
      } else {
        await api.post('/customers', form);
      }
      navigate('/customers');
    } catch (e) {
      alert('Save failed');
    }
  };

  return (
    <Box sx={{ display: 'flex', bgcolor: '#f4f6f8', minHeight: '100vh' }}>
      <Sidebar />
      <Container sx={{ mt: 4, maxWidth: 600 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, color: '#1a3e72' }}>
            {isEdit ? 'Edit Customer' : 'Add New Customer'}
          </Typography>

          {Object.values(errors).map((err, i) => (
            <Alert severity="error" key={i} sx={{ mb: 2 }}>{err}</Alert>
          ))}

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              name="name" label="Full Name" value={form.name} onChange={handleChange}
              error={!!errors.name} helperText={errors.name} required fullWidth
            />
            <TextField
              name="phone" label="Phone" value={form.phone} onChange={handleChange}
              error={!!errors.phone} helperText={errors.phone || 'e.g. 677889900'} required fullWidth
            />
            <TextField
              name="address" label="Address (Yaoundé)" value={form.address} onChange={handleChange}
              fullWidth
            />
            <TextField
              name="email" label="Email" type="email" value={form.email} onChange={handleChange}
              error={!!errors.email} helperText={errors.email} fullWidth
            />
            <Button variant="contained" size="large" onClick={handleSubmit}>
              {isEdit ? 'Update' : 'Create'} Customer
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}