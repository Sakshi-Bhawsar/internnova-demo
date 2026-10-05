import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IMentorProfile extends Document {
  user: Types.ObjectId;
  expertise: string[];
  bio?: string;
  linkedin?: string;
  yearsOfExperience?: number;
  assignedInternships: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const mentorProfileSchema = new Schema<IMentorProfile>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    expertise: [{ type: String, trim: true }],
    bio: { type: String, maxlength: 2000 },
    linkedin: { type: String, trim: true },
    yearsOfExperience: { type: Number, min: 0 },
    assignedInternships: [{ type: Schema.Types.ObjectId, ref: 'Internship' }],
  },
  { timestamps: true }
);

export const MentorProfile = mongoose.model<IMentorProfile>(
  'MentorProfile',
  mentorProfileSchema
);
