// backend/routes/customers.js
const express = require('express');
const { db } = require('../db');
const nodemailer = require('nodemailer');
const router = express.Router();

// GET all customers
router.get('/', (req, res) => {
  db.all("SELECT * FROM Customers ORDER BY id DESC", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// POST create new customer + send email
router.post('/', async (req, res) => {
  const { name, phone, address, email } = req.body;

  if (!name || !phone) {
    return res.status(400).json({ error: 'Name and phone are required' });
  }

  try {
    // 1. Insert into DB
    const result = await new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO Customers (name, phone, address, email) VALUES (?, ?, ?, ?)`,
        [name, phone, address || null, email || null],
        function (err) {
          if (err) reject(err);
          else resolve({ id: this.lastID });
        }
      );
    });

    // 2. Send email (only after success)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'dorianbat8@gmail.com',           // Your Gmail
        pass: 'ofpj sumb annq orts'             // Gmail App Password
      }
    });

    const mailOptions = {
  from: '"Ice Pressing" <dorianbat8@gmail.com>',
  to: 'dorianbat8@gmail.com',
  subject: 'New Customer Registered – Ice Pressing',
  html: `
    <div style="
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      max-width: 600px;
      margin: 20px auto;
      background: #f8f9fa;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(0,0,0,0.1);
    ">
      <!-- Header -->
      <div style="background: linear-gradient(135deg, #1a3e72, #00bcd4); padding: 30px; text-align: center; color: white;">
        <h1 style="margin: 0; font-size: 28px; font-weight: 700;">Ice Pressing</h1>
        <p style="margin: 8px 0 0; font-size: 16px; opacity: 0.9;">Yaoundé Dry Cleaning System</p>
      </div>

      <!-- Body -->
      <div style="padding: 30px; background: white;">
        <h2 style="color: #1a3e72; margin-top: 0; font-size: 22px;">
          New Customer Registered
        </h2>
        <div style="background: #e3f2fd; padding: 20px; border-radius: 12px; border-left: 5px solid #00bcd4;">
          <p style="margin: 8px 0; font-size: 16px;">
            <strong>Name:</strong> <span style="color: #1a3e72;">${name}</span>
          </p>
          <p style="margin: 8px 0; font-size: 16px;">
            <strong>Phone:</strong> <span style="color: #1a3e72;">${phone}</span>
          </p>
          <p style="margin: 8px 0; font-size: 16px;">
            <strong>Address:</strong> <em style="color: #555;">${address || 'Not provided'}</em>
          </p>
          <p style="margin: 8px 0; font-size: 16px;">
            <strong>Email:</strong> <em style="color: #555;">${email || 'Not provided'}</em>
          </p>
        </div>
      </div>

      <!-- Footer -->
      <div style="background: #1a3e72; color: white; text-align: center; padding: 20px; font-size: 14px;">
        <p style="margin: 0;">
          Sent from <strong>Ice Pressing System</strong> • 
          <a href="http://localhost:3000" style="color: #00bcd4; text-decoration: none;">Open Dashboard</a>
        </p>
        <p style="margin: 10px 0 0; font-size: 12px; opacity: 0.8;">
          © 2025 Ice Pressing. All rights reserved.
        </p>
      </div>
    </div>
  `
};
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error('Email failed:', err);
      } else {
        console.log('Email sent:', info.response);
      }
    });

    // 3. Respond to frontend
    res.status(201).json({ ...result, message: 'Customer added & email sent' });

  } catch (err) {
    console.error('DB Error:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;