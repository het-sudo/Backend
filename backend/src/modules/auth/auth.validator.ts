import z from "zod";

export const registerSchmea = {
  body: z.object({
    name: z.string().min(2, "Name Too Short"),
    email: z.string().email("invalid email"),
    password: z.string().min(6, "Minimun passwrod should be of six length"),
  }),
};

export const loginSchema = {
  body: z.object({
    email: z.string().email("Invalid Email"),
    password: z.string().min(6, "Minimun passwrod should be of six length"),
  }),
};

export const userSchema = {
  body: z.object({
    name: z.string().min(2, "Name Too Short"),
    email: z.string().email("invalid email"),
    password: z.string().min(6, "Minimun passwrod should be of six length"),
  }),
};

export const forgotPasswordSchema = {
  body: z.object({
    email: z.string().email(),
  }),
};

export const resetPasswordSchema = {
  body: z.object({
    userId: z.string(),
    token: z.string(),
    oldPassword: z.string().optional(),
    newPassword: z.string().min(6),
  }),
};

export type ResetPasswordBody = z.infer<typeof resetPasswordSchema.body>;
