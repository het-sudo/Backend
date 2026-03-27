import { Document, Types } from "mongoose";
import { type Request } from "express";

export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  refreshToken?: string;
}

export interface Register {
  name: string;
  email: string;
  password: string;
}

export interface Login {
  email: string;
  password: string;
}

export interface TypedRequest<T = {}> extends Request {
  body: T;
  user?: { userId: string; email: string };
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface MyJwtPayload {
  id: string;
  email: string;
  role: string;
}
