import mongoose, { Document, Schema, Types } from 'mongoose';
import {
  InternshipLevel,
  InternshipMode,
  InternshipStage,
  InternshipStatus,
} from '../types/enums';

export interface IFaq {
  question: string;
  answer: string;
}

export interface IWeeklyCurriculum {
  week: number;
  title: string;
  topics: string[];
}

export interface ICertificateCriteria {
  requireAllTasksApproved: boolean;
  requireProjectApproved: boolean;
  requireAssessmentPass: boolean;
  requireEvaluation: boolean;
  minOverallScore: number;
  requireAdminApproval: boolean;
}

export interface IInternship extends Document {
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
  applicationDeadline: Date;
  whatYouLearn: string[];
  skillsRequired: string[];
  eligibility: string;
  weeklyCurriculum: IWeeklyCurriculum[];
  projectInfo?: string;
  assessmentInfo?: string;
  mentorshipInfo?: string;
  certificateCriteria: ICertificateCriteria;
  faqs: IFaq[];
  assignedMentors: Types.ObjectId[];
  stages: InternshipStage[];
  featured: boolean;
  isDemoSeed?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const faqSchema = new Schema<IFaq>(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
  },
  { _id: false }
);

const weekSchema = new Schema<IWeeklyCurriculum>(
  {
    week: { type: Number, required: true },
    title: { type: String, required: true },
    topics: [{ type: String }],
  },
  { _id: false }
);

const certificateCriteriaSchema = new Schema<ICertificateCriteria>(
  {
    requireAllTasksApproved: { type: Boolean, default: true },
    requireProjectApproved: { type: Boolean, default: true },
    requireAssessmentPass: { type: Boolean, default: true },
    requireEvaluation: { type: Boolean, default: true },
    minOverallScore: { type: Number, default: 70 },
    requireAdminApproval: { type: Boolean, default: true },
  },
  { _id: false }
);

const internshipSchema = new Schema<IInternship>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, index: true },
    description: { type: String, required: true },
    category: { type: String, required: true, index: true },
    technologies: [{ type: String, trim: true }],
    durationWeeks: { type: Number, required: true, min: 1 },
    mode: {
      type: String,
      enum: Object.values(InternshipMode),
      required: true,
    },
    level: {
      type: String,
      enum: Object.values(InternshipLevel),
      required: true,
    },
    isPaid: { type: Boolean, default: false },
    price: { type: Number, default: 0, min: 0 },
    status: {
      type: String,
      enum: Object.values(InternshipStatus),
      default: InternshipStatus.DRAFT,
      index: true,
    },
    applicationDeadline: { type: Date, required: true, index: true },
    whatYouLearn: [{ type: String }],
    skillsRequired: [{ type: String }],
    eligibility: { type: String, default: '' },
    weeklyCurriculum: [weekSchema],
    projectInfo: { type: String },
    assessmentInfo: { type: String },
    mentorshipInfo: { type: String },
    certificateCriteria: {
      type: certificateCriteriaSchema,
      default: () => ({}),
    },
    faqs: [faqSchema],
    assignedMentors: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    stages: {
      type: [{ type: String, enum: Object.values(InternshipStage) }],
      default: Object.values(InternshipStage),
    },
    featured: { type: Boolean, default: false, index: true },
    isDemoSeed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Internship = mongoose.model<IInternship>('Internship', internshipSchema);
