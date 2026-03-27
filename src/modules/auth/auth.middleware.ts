import jwt from "jsonwebtoken";
import { type Request, type Response, type NextFunction } from "express";
import { logger } from "../../common/utils/loggers.js";
import { env } from "../../config/env.js";
import type { MyJwtPayload } from "./auth.interface.js";

interface AuthRequest extends Request {
  user?: MyJwtPayload;
}

const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  let token = req.headers.authorization || req.cookies?.accessToken;

  if (!token) {
    logger.warn("Unauthorized: No token provided");
    return res.status(401).json({
      success: false,
      message: "No token provided - unauthorized",
    });
  }

  if (token.startsWith("Bearer ")) {
    token = token.slice(7);
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as MyJwtPayload;

    req.user = decoded;

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
