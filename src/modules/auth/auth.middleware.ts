import jwt from "jsonwebtoken";
import { type RequestHandler } from "express";
import { logger } from "../../common/utils/loggers.js";

const authMiddleware: RequestHandler = (req, res, next) => {
  let token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({
      message: "No token provided - unauthorized",
    });
  }

  if (token.startsWith("Bearer ")) {
    token = token.slice(7);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "SECRET");

    (req as any).user = decoded;

    return next();
  } catch (error) {
    logger.warn("Invalid token");

    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};

export default authMiddleware;

//add some logger files some nominal comments in my backend project
//correct jwt code and update with acess token and referesh token functionality and explain how it work and how i can test
//
