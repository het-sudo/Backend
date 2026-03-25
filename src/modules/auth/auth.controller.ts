import asyncHandler from "../../common/utils/asyncHandler.js";
import type { Login, Register, TypedRequest } from "./auth.interface.js";
import ApiError from "../../common/errors/ApiError.js";
import * as authService from "./auth.service.js";
import type { Request, Response, RequestHandler } from "express";

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
      message: "User registered successfully",
      user: newUser,
    });
  },
);
export const login: RequestHandler = asyncHandler(
  async (req: TypedRequest<Login>, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new ApiError(400, "All fields are Required");
    }
    const { token, user } = await authService.loginUser({ email, password });

    res.status(200).json({
      message: "User login success",
      token,
      user,
    });
  },
);

export const logout: RequestHandler = asyncHandler(
  async (req, res: Response) => {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) {
      throw new ApiError(400, "Token is required");
    }
    await authService.logoutUser(token);
    res.status(200).json({
      message: "User logged out successfully",
    });
  },
);
