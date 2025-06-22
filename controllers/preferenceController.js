import { ApiError } from "../utils/ApiError.js";

export const createPreference = async (req, res, next) => {
  const db = req.db;
  const {
    name,
    budget,
    number,
    currency = "INR",
    destination,
    preferences,
  } = req.body;
  if (!name || !budget || !number || !destination) {
    return next(new ApiError("Missing required fields", 400));
  }

  try {
    await db.run(
      `INSERT INTO user_preferences 
       (name, budget, number, currency, destination, preferences)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        name,
        budget,
        number,
        currency,
        destination,
        JSON.stringify(preferences || {}),
      ]
    );
    res.status(201).json({ message: "Preferences saved" });
  } catch (err) {
    next(new ApiError("Database insert failed", 500));
  }
};

export const getPreferences = async (req, res, next) => {
  const db = req.db;
  const { number } = req.query;

  if (!number) return next(new ApiError("Missing number in query", 400));

  try {
    const rows = await db.all(
      `SELECT * FROM user_preferences WHERE number = ?`,
      [number]
    );

    const result = rows.map((row) => ({
      ...row,
      preferences: JSON.parse(row.preferences || "{}"),
    }));

    res.json(result);
  } catch (err) {
    next(new ApiError("Database fetch error", 500));
  }
};

export const updatePreferences = async (req, res, next) => {
  const db = req.db;
  const { number } = req.query;
  const { preferences } = req.body;

  if (!number || !preferences) {
    return next(new ApiError("Missing required parameters", 400));
  }

  try {
    await db.run(
      `UPDATE user_preferences SET preferences = ? WHERE number = ?`,
      [JSON.stringify(preferences), number]
    );
    res.json({ message: "Preferences updated" });
  } catch (err) {
    next(new ApiError("Database update failed", 500));
  }
};

export const deletePreferences = async (req, res, next) => {
  const db = req.db;
  const { number } = req.query;

  if (!number) return next(new ApiError("Missing number in parameters", 400));

  try {
    await db.run(`DELETE FROM user_preferences WHERE number = ?`, [number]);
    res.json({ message: "Preferences deleted" });
  } catch (err) {
    next(new ApiError("Database delete failed", 500));
  }
};