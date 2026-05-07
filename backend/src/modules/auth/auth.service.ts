import ApiError from "../../common/errors/ApiError.js";
import type { IUser, Register, Login } from "./auth.interface.js";
import { User, Session } from "./auth.modal.js";
import bcrypt from "bcrypt";
import crypto from "node:crypto";
import ms from "ms";
import { env } from "../../config/env.js";
import { logger } from "../../common/utils/loggers.js";
import jwt, { type SignOptions } from "jsonwebtoken";
import { sendResetLink } from "../../middlewares/Email.js";
import { redis } from "../../config/redis.js";

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

// Helper to hash tokens
const hashToken = (token: string) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

// Authenticates user and generates login tokens

export const loginUser = async ({ email, password }: Login) => {
  try {
    const exist = await User.findOne({ email });

    if (!exist) {
      logger.warn(`Login attempt for non-existent email: ${email}`);
      throw new ApiError(401, "Invalid email or password");
    }

    if (!exist.password) {
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

    const hashedToken = hashToken(refreshToken);
    const expiresAt = new Date(Date.now() + ms(env.REFRESH_TOKEN_EXPIRY));

    await Session.create({
      userId: exist._id,
      token: hashedToken,
      type: "REFRESH",
      expiresAt,
    });

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

  try {
    const decoded = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET) as {
      userId: string;
    };

    const hashedToken = hashToken(refreshToken);

    // Find the session in DB
    const session = await Session.findOne({
      userId: decoded.userId,
      token: hashedToken,
      type: "REFRESH",
    });

    // REUSE DETECTION:
    // If the token is valid but NOT found in DB, it might have been stolen and reused (causing rotation elsewhere)
    if (!session) {
      await Session.deleteMany({ userId: decoded.userId });
      logger.error(
        `Potential refresh token reuse attack detected for user: ${decoded.userId}. All sessions revoked.`,
      );
      throw new ApiError(403, "Invalid refresh token - reuse detected");
    }

    // EXPIRY TRACKING in DB:
    if (session.expiresAt < new Date()) {
      await session.deleteOne();
      throw new ApiError(401, "Refresh token expired");
    }

    const user = await User.findById(decoded.userId);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    // REFRESH TOKEN ROTATION:
    // 1. Delete the old token
    await session.deleteOne();

    // 2. Generate new pair
    const tokens = generateTokens(user);

    // 3. Store the new hashed refresh token
    const newHashedToken = hashToken(tokens.refreshToken);
    const expiresAt = new Date(Date.now() + ms(env.REFRESH_TOKEN_EXPIRY));

    await Session.create({
      userId: user._id,
      token: newHashedToken,
      expiresAt,
    });

    logger.info(`Tokens rotated for user: ${user.email}`);

    return tokens;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    logger.warn(`Invalid refresh token attempt: ${error}`);
    throw new ApiError(403, "Invalid refresh token");
  }
};

// Logs out user

export const logoutUser = async (
  userId: string,
): Promise<{ message: string }> => {
  await Session.deleteMany({ userId });

  logger.info(`User logged out successfully: ${userId}`);
  return { message: "Logged out successfully" };
};

//FORGOT
export const forgotPassword = async (email: string) => {
  const user = await User.findOne({ email });

  if (!user) {
    //  existence
    return { message: "If email exists, reset token generated" };
  }

  const rawToken = crypto.randomBytes(32).toString("hex");
  // const hashedToken = hashToken(rawToken);

  // const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

  // await Session.create({
  //   userId: user._id,
  //   token: hashedToken,
  //   type: "RESET_PASSWORD",
  //   expiresAt,
  // });

  await redis.set(
    `reset:${rawToken}`,
    user._id.toString(),
    "EX",
    15 * 60
  );


  const reset_link = `${process.env.CLIENT_URL}/reset-password?token=${rawToken}`;
  await sendResetLink(user.email, reset_link);

  return {
    message: "If Email Exist Reset Email Sent",
    // resetToken: rawToken,
    // userId: user._id,
    // expiresIn: "15 minutes",
  };
};

//reset

export const resetPassword = async ({
  // userId,
  token,
  newPassword,
}: {
  userId: string;
  token: string;
  newPassword: string;
}) => {
    const key = `reset:${token}`;

  const userId = await redis.get(key);
  const hashedToken = hashToken(token);

  if (!token || !userId || !newPassword) {
    throw new ApiError(400, "Missing fields");
  }
    if (!userId) {
    throw new ApiError(400, "Invalid or expired token");
  }

  if (newPassword.length < 8) {
    throw new ApiError(400, "Password too weak");
  }
  // const session = await Session.findOne({
  //   userId,
  //   token: hashedToken,
  //   type: "RESET_PASSWORD",
  //   expiresAt: { $gt: new Date() },
  // });

  // if (!session) {
  //   throw new ApiError(400, "Invalid token");
  // }

  // if (session.expiresAt < new Date()) {
  //   await session.deleteOne();
  //   throw new ApiError(400, "Token expired");
  // }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await User.findByIdAndUpdate(userId, {
    password: hashedPassword,
  });

  // // delete reset tokens
  // await Session.deleteMany({
  //   userId,
  //   type: "RESET_PASSWORD",
  // });

  // // logout all sessions (security)
  // await Session.deleteMany({
  //   userId,
  //   type: "REFRESH",
  // });

  await redis.del(key);

  return { message: "Password reset successful" };
};
// change pass after login
export const changePassword = async ({
  userId,
  oldPassword,
  newPassword,
}: {
  userId: string;
  oldPassword: string;
  newPassword: string;
}) => {
  const user = await User.findById(userId);

  if (!user || !user.password) {
    throw new ApiError(404, "User not found");
  }

  const isMatch = await bcrypt.compare(oldPassword, user.password);

  if (!isMatch) {
    throw new ApiError(400, "Old password is incorrect");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await User.findByIdAndUpdate(userId, {
    password: hashedPassword,
  });

  await Session.deleteMany({
    userId,
    type: "REFRESH",
  });
};
