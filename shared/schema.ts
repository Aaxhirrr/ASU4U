import { z } from "zod";

// Export auth models
export * from "./models/auth";

// User schema
export interface User {
  id: string;
  profilePhoto: string;
  username: string;
  password: string;
  email: string;
  name: string;
  asuId: string;
  major: string;
  age: number;
  year: string;
  courses: string[];
  description: string;
  interests: string[];
  friends: string[];
  lastCheckInDate: string | null;
  checkInStreak: number;
  hideAge: boolean;
  hideYear: boolean;
}

export const insertUserSchema = z.object({
  profilePhoto: z.string().optional().default(""),
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  email: z.string().email("Please enter a valid email").optional().or(z.literal("")),
  name: z.string().optional().default(""),
  asuId: z.string().min(1, "ASU ID is required"),
  major: z.string().min(1, "Major is required"),
  age: z.number().min(16, "Age must be at least 16").max(100, "Please enter a valid age"),
  year: z.string().min(1, "Year is required"),
  courses: z.array(z.string()).optional().default([]),
  description: z.string().optional().default(""),
  interests: z.array(z.string()).optional().default([]),
  hideAge: z.boolean().optional().default(false),
  hideYear: z.boolean().optional().default(false),
});

// Schema for login
export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

// Schema for registration
export const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  email: z.string().min(1, "Email is required").email("Please enter a valid email").refine(
    (email) => email.toLowerCase().endsWith("@asu.edu"),
    "Only ASU email addresses (@asu.edu) are allowed"
  ),
});

// Schema for profile completion (after registration)
export const profileUpdateSchema = z.object({
  profilePhoto: z.string().optional(),
  name: z.string().optional(),
  asuId: z.string().min(1, "ASU ID is required"),
  major: z.string().min(1, "Major is required"),
  age: z.number().min(16, "Age must be at least 16").max(100, "Please enter a valid age"),
  year: z.string().min(1, "Year is required"),
  courses: z.array(z.string()).optional(),
  description: z.string().optional(),
  interests: z.array(z.string()).optional(),
  hideAge: z.boolean().optional(),
  hideYear: z.boolean().optional(),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;

// Group schema
export interface Group {
  id: string;
  name: string;
  description: string;
  rules: string[];
  members: string[];
}

export const insertGroupSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  rules: z.array(z.string()).optional().default([]),
});

export type InsertGroup = z.infer<typeof insertGroupSchema>;

// Group Message schema
export interface GroupMessage {
  id: string;
  groupId: string;
  userId: string;
  content: string;
  timestamp: string;
}

export const insertGroupMessageSchema = z.object({
  groupId: z.string(),
  userId: z.string(),
  content: z.string().min(1),
});

export type InsertGroupMessage = z.infer<typeof insertGroupMessageSchema>;

// Direct Message schema
export interface DirectMessage {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
}

export const insertDirectMessageSchema = z.object({
  senderId: z.string(),
  receiverId: z.string(),
  content: z.string().min(1),
});

export type InsertDirectMessage = z.infer<typeof insertDirectMessageSchema>;

// Journal Post schema
export interface JournalPost {
  id: string;
  userId: string;
  content: string;
  allowComments: boolean;
  timestamp: string;
}

export const insertJournalPostSchema = z.object({
  userId: z.string(),
  content: z.string().min(1),
  allowComments: z.boolean().optional().default(true),
});

export type InsertJournalPost = z.infer<typeof insertJournalPostSchema>;

// Comment schema
export interface Comment {
  id: string;
  postId: string;
  userId: string;
  content: string;
  timestamp: string;
}

export const insertCommentSchema = z.object({
  postId: z.string(),
  userId: z.string(),
  content: z.string().min(1),
});

export type InsertComment = z.infer<typeof insertCommentSchema>;
