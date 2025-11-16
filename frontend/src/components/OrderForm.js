// src/components/OrderForm.js
import React, { useState, useEffect } from 'react';
import {
  TextField, Button, Container, Box, Typography, Paper, IconButton,
  Table, TableHead, TableBody, TableRow, TableCell, MenuItem
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import api from '../services/api';
import Sidebar from './Sidebar';
import { useNavigate, useParams } from 'react-router-dom';

const services = [
  { type: 'Chemise', price: 500 },
  { type: 'Pantalon', price: 700 },
  { type: 'Robe', price: 1500 },
  { type: 'Costume', price: 3000 },
];

export default function OrderForm() {
  const { id } = useParams();
  const isEdit = !!id;
  const [customers, setCustomers] = useState([]);
  const [customerId, setCustomerId] = useState('');
  const [items, setItems] = useState([{ type: 'Chemise', qty: 1 }]);
  const [status, setStatus] = useState('Reçu');
  const [due, setDue] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/customers').then(res => setCustomers(res.data));
    if (isEdit) api.get(`/orders/${id}`).then(res => {
      setCustomerId(res.data.customer_id);
      setItems(res.data.items);
      setStatus(res.data.status);
      setDue(res.data.date_due || '');
    });
  }, [id, isEdit]);

  const total = items.reduce((s, i) => s + (services.find(s => s.type === i.type)?.price || 0) * i.qty, 0);

  const handleSubmit = async () => {
    const payload = { customer_id: customerId, items, total_cost: total, status, date_due: due || null };
    try {
      isEdit ? await api.put(`/orders/${id}`, payload) : await api.post('/orders', payload);
      navigate('/orders');
    } catch { alert('Erreur'); }
  };

  return (
    <Box sx={{ display: 'flex', bgcolor: '#f4f6f8', minHeight: '100vh' }}>
      <Sidebar />
      <Container sx={{ mt: 4 }}>
        <Paper sx={{ p: 3, borderRadius: 3 }}>
          <Typography variant="h5" sx={{ mb: 3, color: '#1a3e72', fontWeight: 600 }}>
            {isEdit ? 'Modifier' : 'Nouvelle'} Commande
          </Typography>

          <TextField select label="Client" value={customerId} onChange={e => setCustomerId(e.target.value)} fullWidth sx={{ mb: 2 }}>
            {customers.map(c => <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>)}
          </TextField>

          <Table size="small" sx={{ mb: 2 }}>
            <TableHead><TableRow sx={{ bgcolor: '#1a3e72' }}>
              <TableCell sx={{ color: 'white' }}>Service</TableCell>
              <TableCell sx={{ color: 'white' }}>Qté</TableCell>
              <TableCell sx={{ color: 'white' }}></TableCell>
            </TableRow></TableHead>
            <TableBody>
              {items.map((item, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <TextField select size="small" value={item.type}
                      onChange={e => { const newItems = [...items]; newItems[i].type = e.target.value; setItems(newItems); }}>
                      {services.map(s => <MenuItem key={s.type} value={s.type}>{s.type}</MenuItem>)}
                    </TextField>
                  </TableCell>
                  <TableCell>
                    <TextField type="number" size="small" value={item.qty} sx={{ width: 60 }}
                      onChange={e => { const newItems = [...items]; newItems[i].qty = +e.target.value || 1; setItems(newItems); }} />
                  </TableCell>
                  <TableCell><IconButton size="small" color="error" onClick={() => setItems(items.filter((_, idx) => idx !== i))}><DeleteIcon /></IconButton></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Button startIcon={<AddIcon />} onClick={() => setItems([...items, { type: 'Chemise', qty: 1 }])} sx={{ mb: 2 }}>
            Ajouter
          </Button>

          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TextField select label="Statut" value={status} onChange={e => setStatus(e.target.value)} sx={{ flex: 1 }}>
              {['Reçu','En Nettoyage','Prêt','Livré'].map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
            </TextField>
            <TextField label="Date limite" type="date" value={due} onChange={e => setDue(e.target.value)} InputLabelProps={{ shrink: true }} sx={{ flex: 1 }} />
          </Box>

          <Paper sx={{ p: 2, bgcolor: '#e3f2fd', textAlign: 'right' }}>
            <Typography variant="h6">Total: <strong>{total} FCFA</strong></Typography>
          </Paper>

          <Box sx={{ mt: 3, textAlign: 'right' }}>
            <Button variant="contained" size="large" onClick={handleSubmit}>
              {isEdit ? 'Mettre à jour' : 'Créer'}
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}