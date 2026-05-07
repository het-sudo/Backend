import { Router } from "express";
import type { IRoute } from "../../common/interface/route.interface.js";
import { loginSchema, registerSchmea } from "./auth.validator.js";

import {
  login,
  logout,
  register,
  refreshToken,
  forgotPasswordController,
  resetPasswordController,
  changePasswordController,
} from "./auth.controller.js";
import authMiddleware from "./auth.middleware.js";
import validate from "express-zod-safe";

const router = Router();

// Define endpoints

router.post("/register", validate(registerSchmea), register);
router.post("/login", validate(loginSchema), login);
router.post("/refresh-token", refreshToken);
router.post("/logout", authMiddleware, logout);
router.post("/forgot_password", forgotPasswordController);
router.post("/reset_password", resetPasswordController);
router.post("/change_password", authMiddleware, changePasswordController);

// Export as IRoute object
export const AuthRoutes: IRoute = {
  path: "/auth",
  router: router,
};
