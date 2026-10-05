import mongoose, { Document, Schema } from 'mongoose';
import { MentorStatus, UserRole } from '../types/enums';

export interface IUser extends Document {
  email: string;
  passwordHash: string;
  fullName: string;
  phone?: string;
  role: UserRole;
  education?: string;
  college?: string;
  graduationYear?: number;
  isActive: boolean;
  mentorStatus?: MentorStatus;
  avatarUrl?: string;
  isDemoSeed?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    passwordHash: { type: String, required: true, select: false },
    fullName: { type: String, required: true, trim: true },
    phone: { type: String, trim: true },
    role: {
      type: String,
      enum: Object.values(UserRole),
      required: true,
    },
    education: { type: String, trim: true },
    college: { type: String, trim: true },
    graduationYear: { type: Number },
    isActive: { type: Boolean, default: true },
    mentorStatus: {
      type: String,
      enum: Object.values(MentorStatus),
    },
    avatarUrl: { type: String },
    isDemoSeed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

userSchema.index({ role: 1, isActive: 1 });

export const User = mongoose.model<IUser>('User', userSchema);
