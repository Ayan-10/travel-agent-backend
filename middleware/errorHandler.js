import { logger } from "../utils/logger.js";

export const errorHandler = (err, req, res, next) => {
  logger.error(`${req.method} ${req.originalUrl} ${err.message}`);
  const status = err.status || 500;
  res.status(status).json({
    error: err.message || "Internal Server Error",
  });
};
