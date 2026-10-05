import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IEvaluationCriteria {
  technicalSkills: number;
  taskCompletion: number;
  projectQuality: number;
  communication: number;
  problemSolving: number;
  professionalism: number;
}

export interface IEvaluation extends Document {
  student: Types.ObjectId;
  internship: Types.ObjectId;
  evaluator: Types.ObjectId;
  criteria: IEvaluationCriteria;
  overallScore: number;
  comments?: string;
  createdAt: Date;
  updatedAt: Date;
}

const criteriaSchema = new Schema<IEvaluationCriteria>(
  {
    technicalSkills: { type: Number, required: true, min: 0, max: 10 },
    taskCompletion: { type: Number, required: true, min: 0, max: 10 },
    projectQuality: { type: Number, required: true, min: 0, max: 10 },
    communication: { type: Number, required: true, min: 0, max: 10 },
    problemSolving: { type: Number, required: true, min: 0, max: 10 },
    professionalism: { type: Number, required: true, min: 0, max: 10 },
  },
  { _id: false }
);

const evaluationSchema = new Schema<IEvaluation>(
  {
    student: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    internship: { type: Schema.Types.ObjectId, ref: 'Internship', required: true, index: true },
    evaluator: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    criteria: { type: criteriaSchema, required: true },
    overallScore: { type: Number, required: true, min: 0, max: 100 },
    comments: { type: String },
  },
  { timestamps: true }
);

evaluationSchema.index({ student: 1, internship: 1 }, { unique: true });

export const Evaluation = mongoose.model<IEvaluation>('Evaluation', evaluationSchema);
