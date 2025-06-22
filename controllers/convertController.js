import { ApiError } from "../utils/ApiError.js";
import fetch from "node-fetch";

export const convertCurrency = async (req, res, next) => {
  const { amount, from, to } = req.query;

  if (!amount || !from || !to) {
    return next(new ApiError("Missing required query parameters", 400));
  }

  try {
    const response = await fetch(
      `https://api.exchangerate-api.com/v4/latest/${from}`
    );
    const data = await response.json();

    if (!data.rates[to]) {
      return next(new ApiError("Invalid currency code", 400));
    }

    const converted = Number(amount) * data.rates[to];

    res.json({
      original: `${amount} ${from}`,
      converted: `${converted.toFixed(2)} ${to}`,
      rate: data.rates[to],
    });
  } catch (err) {
    next(new ApiError("External conversion API failed", 500));
  }
};
