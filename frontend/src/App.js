// src/App.js
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import CustomerList from './components/CustomerList';
import CustomerForm from './components/CustomerForm';
import OrderList from './components/OrderList';
import OrderForm from './components/OrderForm';
import InventoryList from './components/InventoryList';
import InventoryForm from './components/InventoryForm';
import PaymentList from './components/PaymentList';
import Reports from './components/reports';

function PrivateRoute({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/customers" element={<PrivateRoute><CustomerList /></PrivateRoute>} />
      <Route path="/customers/new" element={<PrivateRoute><CustomerForm /></PrivateRoute>} />
      <Route path="/customers/:id" element={<PrivateRoute><CustomerForm /></PrivateRoute>} />
      <Route path="/orders" element={<PrivateRoute><OrderList /></PrivateRoute>} />
      <Route path="/orders/new" element={<PrivateRoute><OrderForm /></PrivateRoute>} />
      <Route path="/orders/:id" element={<PrivateRoute><OrderForm /></PrivateRoute>} />
      <Route path="/inventory" element={<PrivateRoute><InventoryList /></PrivateRoute>} />
      <Route path="/inventory/new" element={<PrivateRoute><InventoryForm /></PrivateRoute>} />
      <Route path="/inventory/:id" element={<PrivateRoute><InventoryForm /></PrivateRoute>} />
      <Route path="/payments" element={<PrivateRoute><PaymentList /></PrivateRoute>} />
      <Route path="/reports" element={<PrivateRoute><Reports /></PrivateRoute>} />

      <Route path="/payments/new" element={<PrivateRoute><PaymentForm /></PrivateRoute>} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}