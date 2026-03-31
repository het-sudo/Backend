import ApiError from "../../common/errors/ApiError.js";
import type { IUser, Register, Login } from "./auth.interface.js";
import { User } from "./auth.modal.js";
import bcrypt from "bcrypt";
import { env } from "../../config/env.js";
import { logger } from "../../common/utils/loggers.js";
import jwt, { type SignOptions } from "jsonwebtoken";

const accessTokenOptions: SignOptions = {
  expiresIn: env.ACCESS_TOKEN_EXPIRY,
};

const refreshTokenOptions: SignOptions = {
  expiresIn: env.REFRESH_TOKEN_EXPIRY,
};

//Registers a new user in the system
export const registerUser = async ({
  name,
  email,
  password,
}: Register): Promise<Pick<IUser, "_id" | "name" | "email">> => {
  const exist = await User.findOne({ email });

  if (exist) {
    logger.warn(`Registration failed: User with email ${email} already exists`);
    throw new ApiError(400, "Email already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  logger.info(`User registered successfully: ${email}`);

  const userObj = newUser.toObject();

  const userWithoutPassword = {
    _id: userObj._id,
    name: userObj.name,
    email: userObj.email,
  };

  return userWithoutPassword;
};

//Helper to generate access and refresh tokens
const generateTokens = (user: IUser) => {
  const accessToken = jwt.sign(
    { userId: user._id, email: user.email },
    env.JWT_SECRET,
    accessTokenOptions,
  );

  const refreshToken = jwt.sign(
    { userId: user._id },
    env.JWT_REFRESH_SECRET,
    refreshTokenOptions,
  );

  return { accessToken, refreshToken };
};

// Authenticates user and generates login tokens

export const loginUser = async ({ email, password }: Login) => {
  try {
    const exist = await User.findOne({ email });

    if (!exist) {
      logger.warn(`Login attempt for non-existent email: ${email}`);
      throw new ApiError(401, "Invalid email or password");
    }

    const passwordmatch = await bcrypt.compare(
      password,
      exist.password as string,
    );

    if (!passwordmatch) {
      logger.warn(`Incorrect password for user: ${email}`);
      throw new ApiError(401, "Invalid email or password");
    }

    const { accessToken, refreshToken } = generateTokens(exist);

    exist.refreshToken = refreshToken;
    await exist.save();

    logger.info(`User logged in successfully: ${email}`);

    return {
      accessToken,
      refreshToken,
      user: { _id: exist._id, name: exist.name, email: exist.email },
    };
  } catch (error) {
    if (error instanceof ApiError) throw error;

    const message =
      error instanceof Error ? error.message : "Internal server error";

    logger.error(`Error in loginUser: ${message}`);
    throw new ApiError(500, message);
  }
};

// Refreshes tokens using a valid refresh token

export const refreshUserTokens = async (refreshToken: string) => {
  if (!refreshToken) {
    throw new ApiError(401, "Refresh token is required");
  }

  const decoded = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET) as {
    userId: string;
  };

  const user = await User.findById(decoded.userId);

  if (!user || user.refreshToken !== refreshToken) {
    logger.warn(`Invalid refresh token for userId: ${decoded.userId}`);
    throw new ApiError(403, "Invalid refresh token");
  }

  const tokens = generateTokens(user);

  user.refreshToken = tokens.refreshToken;
  await user.save();

  logger.info(`Tokens refreshed for user: ${user.email}`);

  return tokens;
};

// Logs out user

export const logoutUser = async (
  userId: string,
): Promise<{ message: string }> => {
  await User.findByIdAndUpdate(userId, {
    $unset: { refreshToken: 1 },
  });

  logger.info(`User logged out successfully: ${userId}`);
  return { message: "Logged out successfully" };
};
