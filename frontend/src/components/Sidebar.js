// src/components/Sidebar.js
import React from 'react';
import {
  Drawer, List, ListItem, ListItemText, ListItemIcon,
  Box, Divider, Typography, IconButton, useMediaQuery
} from '@mui/material';
import {
  Dashboard, People, ShoppingCart, Inventory, Payment, Assessment, Logout, Menu
} from '@mui/icons-material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const links = [
  { to: '/', text: 'Dashboard', icon: <Dashboard /> },
  { to: '/customers', text: 'Clients', icon: <People /> },
  { to: '/orders', text: 'Commandes', icon: <ShoppingCart /> },
  { to: '/inventory', text: 'Inventaire', icon: <Inventory /> },
  { to: '/payments', text: 'Paiements', icon: <Payment /> },
  { to: '/reports', text: 'Rapports', icon: <Assessment /> },
];

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width:600px)');
  const [open, setOpen] = React.useState(!isMobile);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <>
      <IconButton
        onClick={() => setOpen(!open)}
        sx={{
          position: 'fixed', top: 16, left: open ? 230 : 16, zIndex: 1300,
          bgcolor: 'white', boxShadow: 3, '&:hover': { bgcolor: '#f0f0f0' }
        }}
      >
        <Menu />
      </IconButton>

      <Drawer
        variant="persistent"
        open={open}
        sx={{
          width: open ? 260 : 0,
          transition: 'width 0.3s ease',
          '& .MuiDrawer-paper': {
            width: 260,
            bgcolor: '#1a3e72',
            color: 'white',
            overflowX: 'hidden',
          },
        }}
      >
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>Ice Pressing</Typography>
            <Typography variant="caption">Yaoundé</Typography>
          </motion.div>
        </Box>
        <Divider sx={{ bgcolor: 'rgba(255,255,255,0.2)' }} />

        <List>
          {links.map(l => (
            <motion.div key={l.to} whileHover={{ x: 8 }} whileTap={{ scale: 0.95 }}>
              <ListItem
                button component={Link} to={l.to}
                selected={location.pathname === l.to}
                sx={{
                  my: 0.5, mx: 2, borderRadius: 2,
                  bgcolor: location.pathname === l.to ? 'rgba(255,255,255,0.2)' : 'transparent',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
                }}
              >
                <ListItemIcon sx={{ color: 'white' }}>{l.icon}</ListItemIcon>
                <ListItemText primary={l.text} />
              </ListItem>
            </motion.div>
          ))}
        </List>

        <Box sx={{ mt: 'auto', p: 2 }}>
          <Divider sx={{ bgcolor: 'rgba(255,255,255,0.2)' }} />
          <ListItem button onClick={handleLogout} sx={{ borderRadius: 2 }}>
            <ListItemIcon sx={{ color: 'white' }}><Logout /></ListItemIcon>
            <ListItemText primary="Déconnexion" />
          </ListItem>
        </Box>
      </Drawer>
    </>
  );
}