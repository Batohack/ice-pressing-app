// backend/routes/orders.js
const express = require('express');
const { db } = require('../db');
const router = express.Router();

// GET all orders (with customer name)
router.get('/', (req, res) => {
  const sql = `
    SELECT o.*, c.name AS customer_name
    FROM Orders o
    LEFT JOIN Customers c ON o.customer_id = c.id
    ORDER BY o.date_received DESC
  `;
  db.all(sql, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    // Parse JSON items string back to array
    rows.forEach(r => r.items = JSON.parse(r.items));
    res.json(rows);
  });
});

// GET one order by id
router.get('/:id', (req, res) => {
  const sql = `
    SELECT o.*, c.name AS customer_name
    FROM Orders o
    LEFT JOIN Customers c ON o.customer_id = c.id
    WHERE o.id = ?
  `;
  db.get(sql, [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Order not found' });
    row.items = JSON.parse(row.items);
    res.json(row);
  });
});

// POST create new order
router.post('/', (req, res) => {
  const {
    customer_id, items, quantity, total_cost,
    status = 'Received', date_received = new Date().toISOString().split('T')[0],
    date_due, notes
  } = req.body;

  if (!customer_id || !items || !total_cost)
    return res.status(400).json({ error: 'customer_id, items, total_cost required' });

  const sql = `
    INSERT INTO Orders
      (customer_id, items, quantity, total_cost, status, date_received, date_due, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;
  db.run(sql,
    [customer_id, JSON.stringify(items), quantity, total_cost,
     status, date_received, date_due || null, notes || null],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID, message: 'Order created' });
    });
});

// PUT update order
router.put('/:id', (req, res) => {
  const fields = [];
  const values = [];
  const allowed = ['customer_id','items','quantity','total_cost','status','date_received','date_due','notes'];

  for (const key of allowed) {
    if (req.body[key] !== undefined) {
      fields.push(`${key} = ?`);
      values.push(key === 'items' ? JSON.stringify(req.body[key]) : req.body[key]);
    }
  }
  if (fields.length === 0) return res.status(400).json({ error: 'No fields to update' });

  values.push(req.params.id);
  const sql = `UPDATE Orders SET ${fields.join(', ')} WHERE id = ?`;

  db.run(sql, values, function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Order not found' });
    res.json({ message: 'Order updated' });
  });
});

// DELETE order
router.delete('/:id', (req, res) => {
  db.run(`DELETE FROM Orders WHERE id = ?`, [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Order not found' });
    res.json({ message: 'Order deleted' });
  });
});

module.exports = router;