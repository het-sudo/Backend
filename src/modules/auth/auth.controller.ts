import asyncHandler from "../../common/utils/asyncHandler.js";
import type { TypedRequest, RefreshTokenRequest } from "./auth.interface.js";
import type { ValidatedRequest } from "express-zod-safe";
import ApiError from "../../common/errors/ApiError.js";
import * as authService from "./auth.service.js";
import type { Response, RequestHandler } from "express";
import { logger } from "../../common/utils/loggers.js";
import type { loginSchema, registerSchmea } from "./auth.validator.js";

//Controller for user registration

export const register: RequestHandler = asyncHandler(
  async (req: ValidatedRequest<typeof registerSchmea>, res: Response) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      throw new ApiError(400, "All fields are required");
    }

    const newUser = await authService.registerUser({
      name,
      email,
      password,
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: newUser,
    });
  },
);

// Controller for user login , Issues both access and refresh tokens

export const login: RequestHandler = asyncHandler(
  async (req: ValidatedRequest<typeof loginSchema>, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new ApiError(400, "Email and password are Required");
    }

    const { accessToken, refreshToken, user } = await authService.loginUser({
      email,
      password,
    });

    logger.info(`Login successful for user: ${email}`);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    }); // 7 days

    res.status(200).json({
      success: true,
      message: "User login success",
      accessToken,
      user,
    });
  },
);

// Controller for refreshing tokens

export const refreshToken: RequestHandler = asyncHandler(
  async (req: TypedRequest<RefreshTokenRequest>, res: Response) => {
    // Try to get refreshToken from cookies or body
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      throw new ApiError(400, "Refresh token is required");
    }

    const tokens = await authService.refreshUserTokens(refreshToken);

    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: "Tokens refreshed successfully",
      accessToken: tokens.accessToken,
    });
  },
);

// Controller for user logout,Clears the refresh token from the database

export const logout: RequestHandler = asyncHandler(
  async (req: TypedRequest, res: Response) => {
    const userId = req.user?.userId;

    if (!userId) {
      throw new ApiError(401, "User not authenticated");
    }

    await authService.logoutUser(userId);

    // Clear cookies on logout
    // res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    res.status(200).json({
      success: true,
      message: "User logged out successfully",
    });
  },
);
