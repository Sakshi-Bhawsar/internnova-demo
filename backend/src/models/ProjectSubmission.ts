import mongoose, { Document, Schema, Types } from 'mongoose';
import { ProjectSubmissionStatus } from '../types/enums';

export interface IProjectSubmission extends Document {
  project: Types.ObjectId;
  student: Types.ObjectId;
  githubUrl?: string;
  liveDemoUrl?: string;
  documentationUrl?: string;
  status: ProjectSubmissionStatus;
  feedback?: string;
  evaluationScores?: Record<string, number>;
  reviewedBy?: Types.ObjectId;
  reviewedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const projectSubmissionSchema = new Schema<IProjectSubmission>(
  {
    project: { type: Schema.Types.ObjectId, ref: 'Project', required: true, index: true },
    student: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    githubUrl: { type: String },
    liveDemoUrl: { type: String },
    documentationUrl: { type: String },
    status: {
      type: String,
      enum: Object.values(ProjectSubmissionStatus),
      default: ProjectSubmissionStatus.NOT_STARTED,
    },
    feedback: { type: String },
    evaluationScores: { type: Schema.Types.Mixed },
    reviewedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    reviewedAt: { type: Date },
  },
  { timestamps: true }
);

projectSubmissionSchema.index({ project: 1, student: 1 }, { unique: true });

export const ProjectSubmission = mongoose.model<IProjectSubmission>(
  'ProjectSubmission',
  projectSubmissionSchema
);
