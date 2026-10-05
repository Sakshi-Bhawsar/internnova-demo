import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IStudentProfile extends Document {
  user: Types.ObjectId;
  degree?: string;
  location?: string;
  skills: string[];
  github?: string;
  linkedin?: string;
  portfolio?: string;
  resumeUrl?: string;
  bio?: string;
  completionPercentage: number;
  createdAt: Date;
  updatedAt: Date;
}

const studentProfileSchema = new Schema<IStudentProfile>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    degree: { type: String, trim: true },
    location: { type: String, trim: true },
    skills: [{ type: String, trim: true }],
    github: { type: String, trim: true },
    linkedin: { type: String, trim: true },
    portfolio: { type: String, trim: true },
    resumeUrl: { type: String },
    bio: { type: String, maxlength: 2000 },
    completionPercentage: { type: Number, default: 0, min: 0, max: 100 },
  },
  { timestamps: true }
);

export const StudentProfile = mongoose.model<IStudentProfile>(
  'StudentProfile',
  studentProfileSchema
);
