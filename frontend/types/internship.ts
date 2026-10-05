export type InternshipMode = 'REMOTE' | 'HYBRID' | 'ONSITE';
export type InternshipLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
export type InternshipStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

export interface InternshipSummary {
  _id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  technologies: string[];
  durationWeeks: number;
  mode: InternshipMode;
  level: InternshipLevel;
  isPaid: boolean;
  price: number;
  status: InternshipStatus;
  applicationDeadline: string;
  featured: boolean;
  createdAt: string;
}

export interface WeeklyCurriculum {
  week: number;
  title: string;
  topics: string[];
}

export interface Faq {
  question: string;
  answer: string;
}

export interface InternshipDetail extends InternshipSummary {
  whatYouLearn: string[];
  skillsRequired: string[];
  eligibility: string;
  weeklyCurriculum: WeeklyCurriculum[];
  projectInfo?: string;
  assessmentInfo?: string;
  mentorshipInfo?: string;
  faqs: Faq[];
  assignedMentors: { _id: string; fullName: string; avatarUrl?: string }[];
}

export interface InternshipListParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  tech?: string;
  mode?: InternshipMode;
  level?: InternshipLevel;
  paid?: 'true' | 'false';
  duration?: number;
  sort?: 'newest' | 'oldest' | 'deadline';
  featured?: 'true' | 'false';
}
