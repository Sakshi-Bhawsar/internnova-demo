export interface StudentProfile {
  _id: string;
  user: string;
  degree?: string;
  location?: string;
  skills: string[];
  github?: string;
  linkedin?: string;
  portfolio?: string;
  resumeUrl?: string;
  bio?: string;
  completionPercentage: number;
  createdAt: string;
  updatedAt: string;
}

export interface StudentProfileUser {
  fullName: string;
  email: string;
  phone?: string;
  college?: string;
  education?: string;
  graduationYear?: number;
  avatarUrl?: string;
}

export interface StudentProfileResponse {
  profile: StudentProfile;
  user: StudentProfileUser;
  completionPercentage: number;
}

export interface UpdateStudentProfilePayload {
  fullName?: string;
  phone?: string;
  college?: string;
  education?: string;
  graduationYear?: number;
  degree?: string;
  location?: string;
  skills?: string[];
  github?: string;
  linkedin?: string;
  portfolio?: string;
  bio?: string;
}
