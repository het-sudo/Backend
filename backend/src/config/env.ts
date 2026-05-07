import "dotenv/config";
import type { StringValue } from "ms";
import { z } from "zod";

const envSchema = z.object({
  PORT: z.string().default("5000"),
  MONGO_URI: z.string().url(),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  JWT_SECRET: z.string(),
  JWT_REFRESH_SECRET: z.string(),
  ACCESS_TOKEN_EXPIRY: z.string().default("1h") as z.ZodType<StringValue>,
  REFRESH_TOKEN_EXPIRY: z.string().default("7d") as z.ZodType<StringValue>,
});

export const env = envSchema.parse(process.env);
