import mongoose, { Document, Schema, Types } from 'mongoose';
import { InternshipLevel } from '../types/enums';

export interface ITask extends Document {
  internship: Types.ObjectId;
  title: string;
  description: string;
  instructions: string;
  dueDate?: Date;
  difficulty: InternshipLevel;
  technologies: string[];
  resources: string[];
  submissionType: string;
  order: number;
  isRequired: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const taskSchema = new Schema<ITask>(
  {
    internship: {
      type: Schema.Types.ObjectId,
      ref: 'Internship',
      required: true,
      index: true,
    },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    instructions: { type: String, default: '' },
    dueDate: { type: Date },
    difficulty: {
      type: String,
      enum: Object.values(InternshipLevel),
      default: InternshipLevel.BEGINNER,
    },
    technologies: [{ type: String }],
    resources: [{ type: String }],
    submissionType: { type: String, default: 'URL_OR_TEXT' },
    order: { type: Number, default: 0 },
    isRequired: { type: Boolean, default: true },
  },
  { timestamps: true }
);

taskSchema.index({ internship: 1, order: 1 });

export const Task = mongoose.model<ITask>('Task', taskSchema);
