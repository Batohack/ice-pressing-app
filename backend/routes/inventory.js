// backend/routes/inventory.js
const express = require('express');
const { db } = require('../db');
const router = express.Router();

// GET all inventory items
router.get('/', (req, res) => {
  db.all(`SELECT * FROM Inventory ORDER BY name`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// GET one item
router.get('/:id', (req, res) => {
  db.get(`SELECT * FROM Inventory WHERE id = ?`, [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Item not found' });
    res.json(row);
  });
});

// POST new item
router.post('/', (req, res) => {
  const { name, quantity, reorder_level } = req.body;
  if (!name || quantity === undefined)
    return res.status(400).json({ error: 'name and quantity required' });

  db.run(
    `INSERT INTO Inventory (name, quantity, reorder_level) VALUES (?, ?, ?)`,
    [name, quantity, reorder_level || null],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID, message: 'Item added' });
    }
  );
});

// PUT update item
router.put('/:id', (req, res) => {
  const { name, quantity, reorder_level } = req.body;
  if (!name && quantity === undefined && reorder_level === undefined)
    return res.status(400).json({ error: 'Nothing to update' });

  const sql = `
    UPDATE Inventory
    SET name = COALESCE(?, name),
        quantity = COALESCE(?, quantity),
        reorder_level = COALESCE(?, reorder_level),
        last_updated = CURRENT_DATE
    WHERE id = ?
  `;
  db.run(sql, [name || null, quantity ?? null, reorder_level ?? null, req.params.id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0) return res.status(404).json({ error: 'Item not found' });
      res.json({ message: 'Item updated' });
    });
});

// DELETE item
router.delete('/:id', (req, res) => {
  db.run(`DELETE FROM Inventory WHERE id = ?`, [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Item not found' });
    res.json({ message: 'Item deleted' });
  });
});

module.exports = router;