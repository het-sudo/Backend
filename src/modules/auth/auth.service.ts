import ApiError from "../../common/errors/ApiError.js";
import type { IUser, Register, Login } from "./auth.interface.js";
import { User } from "./auth.modal.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { env } from "../../config/env.js";
import { logger } from "../../common/utils/loggers.js";

/**
 * Registers a new user in the system
 * @param reqData Registration data containing name, email, and password
 * @returns Sanitized user object without password
 */
export const registerUser = async ({
  name,
  email,
  password,
}: Register): Promise<Pick<IUser, "_id" | "name" | "email">> => {
  try {
    // Check if user already exists
    const exist = await User.findOne({ email });
    if (exist) {
      logger.warn(
        `Registration failed: User with email ${email} already exists`,
      );
      throw new ApiError(400, "Email already exists");
    }

    // Hash the password before saving
    const hashedpassword: string = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedpassword,
    });

    logger.info(`User registered successfully: ${email}`);

    const userObj = newUser.toObject();
    const { password: _, ...userWithoutPassword } = userObj;

    return userWithoutPassword as Pick<IUser, "_id" | "name" | "email">;
  } catch (error: any) {
    if (error instanceof ApiError) throw error;
    logger.error(`Error in registerUser: ${error.message}`);
    throw new ApiError(500, error.message || "Internal server error");
  }
};

/**
 * Helper to generate access and refresh tokens
 */
const generateTokens = (user: IUser) => {
  const accessToken = jwt.sign(
    { userId: user._id, email: user.email },
    env.JWT_SECRET,
    { expiresIn: env.ACCESS_TOKEN_EXPIRY as any },
  );

  const refreshToken = jwt.sign({ userId: user._id }, env.JWT_REFRESH_SECRET, {
    expiresIn: env.REFRESH_TOKEN_EXPIRY as any,
  });

  return { accessToken, refreshToken };
};

/**
 * Authenticates user and generates login tokens
 * @param loginData Login credentials (email, password)
 * @returns Object containing user info and tokens
 */
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

    // Generate both tokens
    const { accessToken, refreshToken } = generateTokens(exist);

    // Save refresh token to user record for later validation/revocation
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
    logger.error(`Error in loginUser: ${(error as Error).message}`);
    throw new ApiError(
      500,
      (error as Error).message || "Internal server error",
    );
  }
};

/*Refreshes an access token using a valid refresh token
 */
export const refreshUserTokens = async (refreshToken: string) => {
  try {
    if (!refreshToken) {
      throw new ApiError(401, "Refresh token is required");
    }

    // Verify token
    const decoded = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET) as {
      userId: string;
    };

    // Find user by ID and check if token matches
    const user = await User.findById(decoded.userId);

    if (!user || user.refreshToken !== refreshToken) {
      logger.warn(`Invalid refresh token for userId: ${decoded.userId}`);
      throw new ApiError(403, "Invalid refresh token");
    }

    // Generate new tokens
    const tokens = generateTokens(user);

    // Update stored refresh token
    user.refreshToken = tokens.refreshToken;
    await user.save();

    logger.info(`Tokens refreshed for user: ${user.email}`);

    return tokens;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    logger.error(`Error in refreshTokens: ${(error as Error).message}`);
    throw new ApiError(401, "Invalid or expired refresh token");
  }
};

/**
 * Logs out user by clearing the stored refresh token
 */
export const logoutUser = async (
  userId: string,
): Promise<{ message: string }> => {
  try {
    await User.findByIdAndUpdate(userId, { $unset: { refreshToken: 1 } });
    logger.info(`User logged out successfully: ${userId}`);
    return { message: "Logged out successfully" };
  } catch (error) {
    logger.error(
      `Logout failed for user ${userId}: ${(error as Error).message}`,
    );
    throw new ApiError(500, (error as Error).message || "Logout failed");
  }
};
