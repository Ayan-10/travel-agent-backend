import sqlite3 from "sqlite3";
import { open } from "sqlite";
import { logger } from "../utils/logger.js";
import dotenv from "dotenv";
dotenv.config();

export const initDb = async () => {
  const db = await open({
    filename: process.env.DB_PATH || "./phronetic.db",
    driver: sqlite3.Database,
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS user_preferences (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      budget TEXT NOT NULL,
      number TEXT NOT NULL UNIQUE,
      currency TEXT DEFAULT 'INR',
      destination TEXT NOT NULL,
      preferences TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  logger.info("SQLite DB initialized");
  return db;
};
