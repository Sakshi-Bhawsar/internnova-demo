import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IAssessment extends Document {
  internship: Types.ObjectId;
  title: string;
  description: string;
  passingScore: number;
  durationMinutes: number;
  maxAttempts: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const assessmentSchema = new Schema<IAssessment>(
  {
    internship: {
      type: Schema.Types.ObjectId,
      ref: 'Internship',
      required: true,
      index: true,
    },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    passingScore: { type: Number, default: 70, min: 0, max: 100 },
    durationMinutes: { type: Number, default: 30, min: 1 },
    maxAttempts: { type: Number, default: 2, min: 1 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Assessment = mongoose.model<IAssessment>('Assessment', assessmentSchema);
