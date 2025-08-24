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

export const getReviewSchema = (isLoggedIn: boolean) =>
  z.object({
    rating: z.number().min(1, "Please select a rating."),
    title: z.string().optional(), // always optional
    comment: z.string().min(10, "Comment must be at least 10 characters."),
    username: isLoggedIn
      ? z.string().optional()
      : z.string().min(1, "Username is required."),
    email: isLoggedIn
      ? z.union([z.string().email(), z.literal("")]).optional()
      : z.string().email("Valid email is required."),
    files: z.array(z.instanceof(File)).max(2).optional(),
  });

// export type ReviewSchemaType<IsLoggedIn extends boolean> = z.infer<
//   ReturnType<typeof getReviewSchema>
// >;
