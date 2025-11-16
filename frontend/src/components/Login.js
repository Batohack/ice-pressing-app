// src/components/Login.js
import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Container, Paper } from '@mui/material';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await api.post('/auth/login', { username, password });
      localStorage.setItem('token', res.data.token);
      navigate('/');
    } catch (e) {
      alert('Login failed – check username/password');
    }
  };

  return (
    <Box
      sx={{
        bgcolor: '#1a3e72',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Container maxWidth="xs">
        <Paper elevation={10} sx={{ p: 4, borderRadius: 3 }}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#1a3e72' }}>
              Ice Pressing
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Dry Cleaning Management – Yaoundé
            </Typography>
          </Box>
          <TextField
            margin="normal"
            fullWidth
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="normal"
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ mb: 3 }}
          />
          <Button
            variant="contained"
            fullWidth
            size="large"
            onClick={handleLogin}
            sx={{ py: 1.5, fontSize: '1.1rem' }}
          >
            Login
          </Button>
        </Paper>
      </Container>
    </Box>
  );
}