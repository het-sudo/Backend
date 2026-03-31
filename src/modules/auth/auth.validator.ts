import z from "zod";

export const registerSchmea = {
  body: z.object({
    name: z.string().min(2, "Name Too Short"),
    email: z.email("invalid email"),
    password: z.string().min(6, "Minimun passwrod should be of six length"),
  }),
};

export const loginSchema = {
  body: z.object({
    email: z.email("Invalid Email"),
    password: z.string().min(6, "Minimun passwrod should be of six length"),
  }),
};

export const userSchema = {
  body: z.object({
    name: z.string().min(2, "Name Too Short"),
    email: z.email("invalid email"),
    password: z.string().min(6, "Minimun passwrod should be of six length"),
  }),
};
