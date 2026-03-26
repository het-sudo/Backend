import jwt from "jsonwebtoken";
import { type RequestHandler } from "express";
import { logger } from "../../common/utils/loggers.js";
import { env } from "../../config/env.js";

/**
 * Middleware to protect routes by verifying JWT in Authorization header
 */
const authMiddleware: RequestHandler = (req, res, next) => {
  // Check Authorization header or cookies
  let token = req.headers.authorization || req.cookies.accessToken;

  if (!token) {
    logger.warn("Unauthorized: No token provided");
    return res.status(401).json({
      success: false,
      message: "No token provided - unauthorized",
    });
  }

  // Handle 'Bearer <token>' format
  if (token.startsWith("Bearer ")) {
    token = token.slice(7);
  }

  try {
    // Verify accessToken
    const decoded = jwt.verify(token, env.JWT_SECRET);

    // Attach user payload to request
    (req as any).user = decoded;

    return next();
  } catch (error) {
    logger.warn("Unauthorized: Invalid or expired token");

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

export default authMiddleware;
