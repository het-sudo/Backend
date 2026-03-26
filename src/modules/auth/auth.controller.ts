import asyncHandler from "../../common/utils/asyncHandler.js";
import type {
  Login,
  Register,
  TypedRequest,
  RefreshTokenRequest,
} from "./auth.interface.js";
import ApiError from "../../common/errors/ApiError.js";
import * as authService from "./auth.service.js";
import type { Request, Response, RequestHandler } from "express";
import { logger } from "../../common/utils/loggers.js";

//Controller for user registration

export const register: RequestHandler = asyncHandler(
  async (req: Request<{}, {}, Register>, res: Response) => {
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
  async (req: TypedRequest<Login>, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new ApiError(400, "Email and password are Required");
    }

    const { accessToken, refreshToken, user } = await authService.loginUser({
      email,
      password,
    });

    logger.info(`Login successful for user: ${email}`);

    // Set cookies
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 15 * 60 * 1000,
    }); // 15 mins
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    }); // 7 days

    res.status(200).json({
      success: true,
      message: "User login success",
      accessToken,
      refreshToken,
      user,
    });
  },
);

// Controller for refreshing tokens

export const refreshToken: RequestHandler = asyncHandler(
  async (req: TypedRequest<RefreshTokenRequest>, res: Response) => {
    // Try to get refreshToken from cookies or body
    const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (!refreshToken) {
      throw new ApiError(400, "Refresh token is required");
    }

    const tokens = await authService.refreshUserTokens(refreshToken);

    // Update cookies
    res.cookie("accessToken", tokens.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 15 * 60 * 1000,
    });
    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: "Tokens refreshed successfully",
      ...tokens,
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
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    res.status(200).json({
      success: true,
      message: "User logged out successfully",
    });
  },
);
