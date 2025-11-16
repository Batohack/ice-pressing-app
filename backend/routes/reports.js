// backend/routes/reports.js
const express = require('express');
const { db } = require('../db');
const router = express.Router();

/* -------------------------------------------------
   1. Daily summary (today)
   ------------------------------------------------- */
router.get('/daily', (req, res) => {
  const today = new Date().toISOString().split('T')[0];

  const queries = {
    orders: `SELECT COUNT(*) AS count FROM Orders WHERE date_received = ?`,
    revenue: `SELECT COALESCE(SUM(p.amount),0) AS total FROM Payments p
              JOIN Orders o ON p.order_id = o.id
              WHERE o.date_received = ?`,
    pending: `SELECT COUNT(*) AS count FROM Orders
              WHERE status != 'Delivered' AND date_received = ?`,
    lowStock: `SELECT name, quantity, reorder_level FROM Inventory
               WHERE quantity <= reorder_level`
  };

  const result = {};

  db.get(queries.orders, [today], (e, r) => { result.ordersToday = r.count; next(); });
  db.get(queries.revenue, [today], (e, r) => { result.revenueToday = r.total; next(); });
  db.get(queries.pending, [today], (e, r) => { result.pendingToday = r.count; next(); });
  db.all(queries.lowStock, [], (e, rows) => { result.lowStock = rows; next(); });

  let done = 0;
  function next() {
    if (++done === 4) res.json(result);
  }
});

/* -------------------------------------------------
   2. Outstanding payments (orders not fully paid)
   ------------------------------------------------- */
router.get('/outstanding', (req, res) => {
  const sql = `
    SELECT o.id, o.total_cost,
           COALESCE(SUM(p.amount),0) AS paid,
           (o.total_cost - COALESCE(SUM(p.amount),0)) AS due,
           c.name AS customer_name
    FROM Orders o
    LEFT JOIN Payments p ON o.id = p.order_id
    JOIN Customers c ON o.customer_id = c.id
    GROUP BY o.id
    HAVING due > 0
    ORDER BY due DESC
  `;
  db.all(sql, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

module.exports = router;