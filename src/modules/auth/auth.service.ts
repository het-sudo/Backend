import ApiError from "../../common/errors/ApiError.js";
import type { IUser, Register, Login } from "./auth.interface.js";
import { User } from "./auth.modal.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const registerUser = async ({
  name,
  email,
  password,
}: Register): Promise<Pick<IUser, "_id" | "name" | "email">> => {
  try {
    const exist = await User.findOne({ email });
    if (exist) {
      throw new ApiError(400, "Email already exists");
    }

    const hashedpassword: string = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedpassword,
    });

    const userObj = newUser.toObject();
    const { password: _, ...userWithoutPassword } = userObj;

    return userWithoutPassword as Pick<IUser, "_id" | "name" | "email">;
  } catch (error: any) {
    if (error instanceof ApiError) throw error;

    throw new ApiError(500, error.message || "Internal server error");
  }
};

export const loginUser = async ({ email, password }: Login) => {
  try {
    const exist = await User.findOne({ email });
    if (!exist) {
      throw new ApiError(401, "Email not Found");
    }

    const passwordmatch = await bcrypt.compare(
      password,
      exist.password as string,
    );

    if (!passwordmatch) {
      throw new ApiError(401, "Password Not matched");
    }

    const token = jwt.sign(
      {
        userId: exist._id,
        email: exist.email,
      },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "1d" },
    );

    return {
      token,
      user: { _id: exist._id, name: exist.name, email: exist.email },
    };
  } catch (error) {
    throw new ApiError(
      500,
      (error as Error).message || "Internal server error",
    );
  }
};

export const logoutUser = async (
  _token: string,
): Promise<{ message: string }> => {
  try {
    // blacklistedTokens.add(token);
    return { message: "Logged out successfully" };
  } catch (error) {
    throw new ApiError(500, (error as Error).message || "Logout failed");
  }
};
