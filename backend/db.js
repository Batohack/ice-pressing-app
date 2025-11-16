// backend/db.js
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./icepressing.db');
const bcrypt = require('bcrypt');

function init() {
  db.serialize(() => {
    // Create tables
    db.run(`CREATE TABLE IF NOT EXISTS Customers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      address TEXT,
      email TEXT,
      registration_date DATE DEFAULT CURRENT_DATE
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS Orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_id INTEGER NOT NULL,
      items TEXT NOT NULL,
      quantity INTEGER,
      total_cost REAL NOT NULL,
      status TEXT DEFAULT 'Received',
      date_received DATE DEFAULT CURRENT_DATE,
      date_due DATE,
      notes TEXT,
      FOREIGN KEY (customer_id) REFERENCES Customers(id) ON DELETE CASCADE
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS Inventory (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      reorder_level INTEGER,
      last_updated DATE DEFAULT CURRENT_DATE
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS Payments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER NOT NULL,
      amount REAL NOT NULL,
      method TEXT,
      date DATE DEFAULT CURRENT_DATE,
      FOREIGN KEY (order_id) REFERENCES Orders(id) ON DELETE CASCADE
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS Users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      role TEXT DEFAULT 'Staff'
    )`);

    // Insert dummy data
    db.get("SELECT COUNT(*) as count FROM Users", (err, row) => {
      if (row.count === 0) {
        const hash = bcrypt.hashSync('password123', 10);
        db.run("INSERT INTO Users (username, password_hash, role) VALUES (?, ?, ?)", ['admin', hash, 'Admin']);
        db.run("INSERT INTO Users (username, password_hash, role) VALUES (?, ?, ?)", ['staff', hash, 'Staff']);
      }
    });

    db.get("SELECT COUNT(*) as count FROM Customers", (err, row) => {
      if (row.count === 0) {
        const customers = [
          ['Jean Dupont', '699123456', 'Bastoss, Yaoundé', 'jean@example.com'],
          ['Marie Ngo', '677654321', 'Mvan, Yaoundé', 'marie@example.com'],
          ['Paul Biya Jr', '688987654', 'Etoudi, Yaoundé', 'paul@example.com']
        ];
        customers.forEach(c => db.run("INSERT INTO Customers (name, phone, address, email) VALUES (?, ?, ?, ?)", c));
      }
    });
  });
}

module.exports = { db, init };