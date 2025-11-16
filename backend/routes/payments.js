// backend/routes/payments.js
const express = require('express');
const { db } = require('../db');
const router = express.Router();

// GET all payments (optionally filter by order_id)
router.get('/', (req, res) => {
  const { order_id } = req.query;
  let sql = `
    SELECT p.*, o.customer_id, c.name AS customer_name
    FROM Payments p
    JOIN Orders o ON p.order_id = o.id
    JOIN Customers c ON o.customer_id = c.id
  `;
  const params = [];
  if (order_id) {
    sql += ` WHERE p.order_id = ?`;
    params.push(order_id);
  }
  sql += ` ORDER BY p.date DESC`;

  db.all(sql, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// GET one payment
router.get('/:id', (req, res) => {
  const sql = `
    SELECT p.*, o.customer_id, c.name AS customer_name
    FROM Payments p
    JOIN Orders o ON p.order_id = o.id
    JOIN Customers c ON o.customer_id = c.id
    WHERE p.id = ?
  `;
  db.get(sql, [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Payment not found' });
    res.json(row);
  });
});

// POST new payment
router.post('/', (req, res) => {
  const { order_id, amount, method = 'Cash' } = req.body;
  if (!order_id || !amount)
    return res.status(400).json({ error: 'order_id and amount required' });

  db.run(
    `INSERT INTO Payments (order_id, amount, method) VALUES (?, ?, ?)`,
    [order_id, amount, method],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID, message: 'Payment recorded' });
    }
  );
});

module.exports = router;