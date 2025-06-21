// File: server.js
require('dotenv').config();
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const apiKeyAuth = require('./auth');

const app = express();
const PORT = process.env.PORT || 3000;
const DB_PATH = process.env.DB_PATH || './phronetic.db';

// Database setup
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) console.error('Database connection error:', err);
  else console.log('Connected to SQLite database');
});

db.run(`
  CREATE TABLE IF NOT EXISTS user_preferences (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    category TEXT NOT NULL,
    preferences TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Middleware
app.use(bodyParser.json());
app.use(morgan('combined'));
app.use(apiKeyAuth);

// CRUD Endpoint for User Preferences
app.route('/preferences')
  .post(async (req, res) => {
    try {
      const { user_id, category, preferences } = req.body;
      if (!user_id || !category) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      await db.run(
        `INSERT INTO user_preferences (user_id, category, preferences) 
         VALUES (?, ?, ?)`,
        [user_id, category, JSON.stringify(preferences)]
      );

      res.status(201).json({ message: 'Preferences saved' });
    } catch (err) {
      res.status(500).json({ error: 'Database error' });
    }
  })
  .get(async (req, res) => {
    try {
      const { user_id, category } = req.query;
      console.log(`Fetching preferences for user_id: ${user_id}, category: ${category}`);
      
      const rows = await new Promise((resolve, reject) => {
        db.all(
          `SELECT * FROM user_preferences 
           WHERE user_id = ? AND category = ?`,
          [user_id, category],
          (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
          }
        );
      });
      
      const result = rows.map(row => ({
        ...row,
        preferences: JSON.parse(row.preferences)
      }));
      
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: 'Database error' });
    }
  });

// Currency Conversion Endpoint
app.get('/convert', async (req, res) => {
  try {
    const { amount, from, to } = req.query;
    if (!amount || !from || !to) {
      return res.status(400).json({ error: 'Missing parameters' });
    }

    const response = await fetch(
      `https://api.exchangerate-api.com/v4/latest/${from}`
    );
    const data = await response.json();
    
    if (!data.rates[to]) {
      return res.status(400).json({ error: 'Invalid currency code' });
    }

    const result = amount * data.rates[to];
    res.json({ 
      original: `${amount} ${from}`,
      converted: `${result.toFixed(2)} ${to}`,
      rate: data.rates[to]
    });
  } catch (err) {
    res.status(500).json({ error: 'Conversion service unavailable' });
  }
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});