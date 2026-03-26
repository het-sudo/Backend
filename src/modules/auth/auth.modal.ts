import { Schema, model } from "mongoose";
import type { IUser } from "./auth.interface.js";

const userSchema: Schema<IUser> = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  refreshToken: {
    type: String,
  },
}, { timestamps: true });

export const User = model<IUser>("User", userSchema);
