import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IProject extends Document {
  internship: Types.ObjectId;
  title: string;
  description: string;
  requirements: string[];
  technologies: string[];
  deliverables: string[];
  submissionDeadline?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const projectSchema = new Schema<IProject>(
  {
    internship: {
      type: Schema.Types.ObjectId,
      ref: 'Internship',
      required: true,
      unique: true,
    },
    title: { type: String, required: true },
    description: { type: String, required: true },
    requirements: [{ type: String }],
    technologies: [{ type: String }],
    deliverables: [{ type: String }],
    submissionDeadline: { type: Date },
  },
  { timestamps: true }
);

export const Project = mongoose.model<IProject>('Project', projectSchema);
