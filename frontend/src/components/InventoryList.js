// src/components/InventoryList.js
import React, { useEffect, useState } from 'react';
import {
  Table, TableHead, TableBody, TableRow, TableCell,
  Container, Typography, Box, Button, Chip, Paper, Fab
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import api from '../services/api';
import Sidebar from './Sidebar';
import { useNavigate } from 'react-router-dom';

export default function InventoryList() {
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/inventory').then(res => setItems(res.data));
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Delete item?')) {
      await api.delete(`/inventory/${id}`);
      setItems(items.filter(i => i.id !== id));
    }
  };

  return (
    <Box sx={{ overflowX: 'auto', bgcolor: 'white', borderRadius: 2, boxShadow: 1 }}>
      <Sidebar />
      <Container sx={{ mt: 4, mb: 8 }}>
        <Paper elevation={2} sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 600, color: '#1a3e72' }}>Inventory</Typography>
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/inventory/new')}>
              Add Item
            </Button>
          </Box>

          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#1a3e72' }}>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Name</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Qty</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Reorder</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Status</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map(i => (
                <TableRow key={i.id} hover>
                  <TableCell>{i.name}</TableCell>
                  <TableCell>{i.quantity}</TableCell>
                  <TableCell>{i.reorder_level}</TableCell>
                  <TableCell>
                    {i.quantity <= i.reorder_level ? 
                      <Chip label="Low" color="error" /> : 
                      <Chip label="OK" color="success" />
                    }
                  </TableCell>
                  <TableCell>
                    <Button size="small" startIcon={<EditIcon />} onClick={() => navigate(`/inventory/${i.id}`)}>Edit</Button>
                    <Button size="small" color="error" startIcon={<DeleteIcon />} onClick={() => handleDelete(i.id)}>Del</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>

        <Fab color="primary" sx={{ position: 'fixed', bottom: 32, right: 32 }} onClick={() => navigate('/inventory/new')}>
          <AddIcon />
        </Fab>
      </Container>
    </Box>
  );
}