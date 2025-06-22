// // File: server.js
// require('dotenv').config();
// const express = require('express');
// const sqlite3 = require('sqlite3').verbose();
// const bodyParser = require('body-parser');
// const morgan = require('morgan');
// const apiKeyAuth = require('./auth');

// const app = express();
// const PORT = process.env.PORT || 3000;
// const DB_PATH = process.env.DB_PATH || './phronetic.db';

// // Database setup
// const db = new sqlite3.Database(DB_PATH, (err) => {
//   if (err) console.error('Database connection error:', err);
//   else console.log('Connected to SQLite database');
// });

// db.run(`
//   CREATE TABLE IF NOT EXISTS user_preferences (
//     id INTEGER PRIMARY KEY AUTOINCREMENT,
//     name TEXT NOT NULL,
//     budget TEXT NOT NULL,
//     number TEXT NOT NULL,
//     currency TEXT DEFAULT 'INR',
//     destination TEXT NOT NULL,
//     preferences TEXT,
//     created_at DATETIME DEFAULT CURRENT_TIMESTAMP
//   )
// `);

// // Middleware
// app.use(bodyParser.json());
// app.use(morgan('combined'));
// app.use(apiKeyAuth);

// // CRUD Endpoint for User Preferences
// app.route('/preferences')
//   .post(async (req, res) => {
//     try {
//       const { name, budget, number, currency, destination, preferences } = req.body;
//       if (!name || !budget || !number || !destination) {
//         return res.status(400).json({ error: 'Missing required fields' });
//       }

//       await db.run(
//         `INSERT INTO user_preferences (name, budget, number, currency, destination, preferences) 
//          VALUES (?, ?, ?, ?, ?, ?)`,
//         [name, budget, number, currency, destination, JSON.stringify(preferences)]
//       );

//       res.status(201).json({ message: 'Preferences saved' });
//     } catch (err) {
//       res.status(500).json({ error: 'Database error' });
//     }
//   })
//   .get(async (req, res) => {
//     try {
//       const { number } = req.query;
//       if (!number) {
//         return res.status(400).json({ error: 'Missing required parameter: number' });
//       }
//       const rows = await new Promise((resolve, reject) => {
//         db.all(
//           `SELECT * FROM user_preferences 
//            WHERE number = ?`,
//           [number],
//           (err, rows) => {
//             if (err) reject(err);
//             else resolve(rows);
//           }
//         );
//       });
      
//       const result = rows.map(row => ({
//         ...row,
//         preferences: JSON.parse(row.preferences)
//       }));
      
//       res.json(result);
//     } catch (err) {
//       res.status(500).json({ error: 'Database error' });
//     }
//   });

// // Currency Conversion Endpoint
// app.get('/convert', async (req, res) => {
//   try {
//     const { amount, from, to } = req.query;
//     if (!amount || !from || !to) {
//       return res.status(400).json({ error: 'Missing parameters' });
//     }

//     const response = await fetch(
//       `https://api.exchangerate-api.com/v4/latest/${from}`
//     );
//     const data = await response.json();
    
//     if (!data.rates[to]) {
//       return res.status(400).json({ error: 'Invalid currency code' });
//     }

//     const result = amount * data.rates[to];
//     res.json({ 
//       original: `${amount} ${from}`,
//       converted: `${result.toFixed(2)} ${to}`,
//       rate: data.rates[to]
//     });
//   } catch (err) {
//     res.status(500).json({ error: 'Conversion service unavailable' });
//   }
// });

// // Error handling
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({ error: 'Internal server error' });
// });

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import { initDb } from "./db/index.js";
import routes from "./routes/index.js";
import { apiKeyAuth } from "./middleware/apiKeyAuth.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { notFound } from "./middleware/notFound.js";
import { logger } from "./utils/logger.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(
  morgan("combined", { stream: { write: (msg) => logger.info(msg.trim()) } })
);

// Attach DB to each request
app.use(async (req, res, next) => {
  try {
    req.db = await initDb();
    next();
  } catch (err) {
    next(err);
  }
});

// API Key Auth
app.use(apiKeyAuth);

// Routes
app.use("/", routes);

// 404 and error handlers
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
