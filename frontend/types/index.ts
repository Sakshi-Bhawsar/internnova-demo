export enum UserRole {
  STUDENT = "STUDENT",
  MENTOR = "MENTOR",
  ADMIN = "ADMIN",
  COMPANY = "COMPANY",
}

export enum MentorStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  phone?: string;
  education?: string;
  college?: string;
  graduationYear?: number;
  isActive: boolean;
  mentorStatus?: MentorStatus;
  avatarUrl?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}
