// src/components/CustomerList.js
import React, { useEffect, useState } from 'react';
import {
  Table, TableHead, TableBody, TableRow, TableCell,
  Container, Typography, Box, Button, Paper, Fab
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import api from '../services/api';
import Sidebar from './Sidebar';
import { useNavigate } from 'react-router-dom';

export default function CustomerList() {
  const [customers, setCustomers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/customers').then(res => setCustomers(res.data));
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Delete customer?')) {
      await api.delete(`/customers/${id}`);
      setCustomers(customers.filter(c => c.id !== id));
    }
  };

  return (
    <Box sx={{ overflowX: 'auto', bgcolor: 'white', borderRadius: 2, boxShadow: 1 }}>
      <Sidebar />
      <Container sx={{ mt: 4, mb: 8 }}>
        <Paper elevation={2} sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 600, color: '#1a3e72' }}>Customers</Typography>
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/customers/new')}>
              Add Customer
            </Button>
          </Box>

          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#1a3e72' }}>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>ID</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Name</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Phone</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Address</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Email</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {customers.map(c => (
                <TableRow key={c.id} hover>
                  <TableCell>{c.id}</TableCell>
                  <TableCell>{c.name}</TableCell>
                  <TableCell>{c.phone}</TableCell>
                  <TableCell>{c.address || '-'}</TableCell>
                  <TableCell>{c.email || '-'}</TableCell>
                  <TableCell>
                    <Button size="small" startIcon={<EditIcon />} onClick={() => navigate(`/customers/${c.id}`)}>Edit</Button>
                    <Button size="small" color="error" startIcon={<DeleteIcon />} onClick={() => handleDelete(c.id)}>Del</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>

        <Fab color="primary" sx={{ position: 'fixed', bottom: 32, right: 32 }} onClick={() => navigate('/customers/new')}>
          <AddIcon />
        </Fab>
      </Container>
    </Box>
  );
}