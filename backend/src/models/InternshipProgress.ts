import mongoose, { Document, Schema, Types } from 'mongoose';
import { InternshipStage } from '../types/enums';

export interface IStageProgressEntry {
  stage: InternshipStage;
  completedAt?: Date;
}

export interface IInternshipProgress extends Document {
  application: Types.ObjectId;
  student: Types.ObjectId;
  internship: Types.ObjectId;
  currentStage: InternshipStage;
  stageProgress: IStageProgressEntry[];
  overallProgress: number;
  createdAt: Date;
  updatedAt: Date;
}

const stageProgressSchema = new Schema<IStageProgressEntry>(
  {
    stage: { type: String, enum: Object.values(InternshipStage), required: true },
    completedAt: { type: Date },
  },
  { _id: false }
);

const internshipProgressSchema = new Schema<IInternshipProgress>(
  {
    application: {
      type: Schema.Types.ObjectId,
      ref: 'Application',
      required: true,
      unique: true,
    },
    student: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    internship: { type: Schema.Types.ObjectId, ref: 'Internship', required: true, index: true },
    currentStage: {
      type: String,
      enum: Object.values(InternshipStage),
      default: InternshipStage.ORIENTATION,
    },
    stageProgress: [stageProgressSchema],
    overallProgress: { type: Number, default: 0, min: 0, max: 100 },
  },
  { timestamps: true }
);

export const InternshipProgress = mongoose.model<IInternshipProgress>(
  'InternshipProgress',
  internshipProgressSchema
);
