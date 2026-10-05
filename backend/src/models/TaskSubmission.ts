import mongoose, { Document, Schema, Types } from 'mongoose';
import { TaskSubmissionStatus } from '../types/enums';

export interface ITaskSubmission extends Document {
  task: Types.ObjectId;
  student: Types.ObjectId;
  internship: Types.ObjectId;
  content?: string;
  fileUrl?: string;
  githubUrl?: string;
  status: TaskSubmissionStatus;
  feedback?: string;
  reviewedBy?: Types.ObjectId;
  reviewedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const taskSubmissionSchema = new Schema<ITaskSubmission>(
  {
    task: { type: Schema.Types.ObjectId, ref: 'Task', required: true, index: true },
    student: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    internship: { type: Schema.Types.ObjectId, ref: 'Internship', required: true },
    content: { type: String },
    fileUrl: { type: String },
    githubUrl: { type: String },
    status: {
      type: String,
      enum: Object.values(TaskSubmissionStatus),
      default: TaskSubmissionStatus.PENDING,
    },
    feedback: { type: String },
    reviewedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    reviewedAt: { type: Date },
  },
  { timestamps: true }
);

taskSubmissionSchema.index({ task: 1, student: 1 }, { unique: true });

export const TaskSubmission = mongoose.model<ITaskSubmission>(
  'TaskSubmission',
  taskSubmissionSchema
);
