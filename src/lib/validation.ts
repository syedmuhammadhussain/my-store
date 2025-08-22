import { z } from "zod";

// Login
export const loginSchema = z.object({
  identifier: z.string().min(1, "Email or email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
export type LoginSchema = z.infer<typeof loginSchema>;

// Register
export const registerSchema = z.object({
  username: z.string().min(2, "Username is too short"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
export type RegisterSchema = z.infer<typeof registerSchema>;

// Forgot password
export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email"),
});
export type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;

// Reset password
export const resetPasswordSchema = z
  .object({
    code: z.string().min(1, "Reset code is required"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    passwordConfirmation: z.string().min(6, "Password confirmation required"),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords do not match",
    path: ["passwordConfirmation"],
  });
export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>;
