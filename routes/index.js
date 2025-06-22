import express from "express";
import {
  createPreference,
  getPreferences,
    updatePreferences, 
    deletePreferences
} from "../controllers/preferenceController.js";
import { convertCurrency } from "../controllers/convertController.js";

const router = express.Router();

router.post("/preferences", createPreference);
router.get("/preferences", getPreferences);
router.put("/preferences", updatePreferences);
router.delete("/preferences", deletePreferences);
router.get("/convert", convertCurrency);

export default router;
