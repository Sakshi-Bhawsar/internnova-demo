export enum UserRole {
  STUDENT = 'STUDENT',
  MENTOR = 'MENTOR',
  ADMIN = 'ADMIN',
  COMPANY = 'COMPANY', // Reserved for future — not implemented in V1
}

export enum MentorStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export enum ApplicationStatus {
  APPLIED = 'APPLIED',
  UNDER_REVIEW = 'UNDER_REVIEW',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  WITHDRAWN = 'WITHDRAWN',
}

export enum InternshipStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
}

export enum InternshipMode {
  REMOTE = 'REMOTE',
  HYBRID = 'HYBRID',
  ONSITE = 'ONSITE',
}

export enum InternshipLevel {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED',
}

export enum TaskSubmissionStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  SUBMITTED = 'SUBMITTED',
  REVIEWED = 'REVIEWED',
  APPROVED = 'APPROVED',
  REVISION_REQUIRED = 'REVISION_REQUIRED',
}

export enum ProjectSubmissionStatus {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  SUBMITTED = 'SUBMITTED',
  UNDER_REVIEW = 'UNDER_REVIEW',
  APPROVED = 'APPROVED',
  REVISION_REQUIRED = 'REVISION_REQUIRED',
}

export enum PaymentStatus {
  CREATED = 'CREATED',
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

export enum CertificateStatus {
  VALID = 'VALID',
  REVOKED = 'REVOKED',
}

export enum InternshipStage {
  ORIENTATION = 'ORIENTATION',
  LEARNING = 'LEARNING',
  TASKS = 'TASKS',
  PROJECT = 'PROJECT',
  ASSESSMENT = 'ASSESSMENT',
  EVALUATION = 'EVALUATION',
  CERTIFICATE = 'CERTIFICATE',
}

export enum InquiryType {
  CONTACT = 'CONTACT',
  COMPANY_INTEREST = 'COMPANY_INTEREST',
}
