import { Router } from "express";
import type { IRoute } from "../../common/interface/route.interface.js";
import { loginSchema, registerSchmea } from "./auth.validator.js";

import { login, logout, register, refreshToken } from "./auth.controller.js";
import authMiddleware from "./auth.middleware.js";
import validate from "express-zod-safe";

const router = Router();

// Define endpoints

router.post("/register", validate(registerSchmea), register);
router.post("/login", validate(loginSchema), login);
router.post("/refresh-token", refreshToken);
router.post("/logout", authMiddleware, logout);

// Export as IRoute object
export const AuthRoutes: IRoute = {
  path: "/auth",
  router: router,
};
