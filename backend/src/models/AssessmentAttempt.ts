import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IAnswerEntry {
  question: Types.ObjectId;
  selectedIndex: number;
}

export interface IAssessmentAttempt extends Document {
  assessment: Types.ObjectId;
  student: Types.ObjectId;
  answers: IAnswerEntry[];
  score: number;
  passed: boolean;
  startedAt: Date;
  submittedAt?: Date;
  attemptNumber: number;
  createdAt: Date;
  updatedAt: Date;
}

const answerSchema = new Schema<IAnswerEntry>(
  {
    question: { type: Schema.Types.ObjectId, ref: 'Question', required: true },
    selectedIndex: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const assessmentAttemptSchema = new Schema<IAssessmentAttempt>(
  {
    assessment: {
      type: Schema.Types.ObjectId,
      ref: 'Assessment',
      required: true,
      index: true,
    },
    student: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    answers: [answerSchema],
    score: { type: Number, default: 0, min: 0, max: 100 },
    passed: { type: Boolean, default: false },
    startedAt: { type: Date, default: Date.now },
    submittedAt: { type: Date },
    attemptNumber: { type: Number, default: 1, min: 1 },
  },
  { timestamps: true }
);

assessmentAttemptSchema.index({ assessment: 1, student: 1, attemptNumber: 1 }, { unique: true });

export const AssessmentAttempt = mongoose.model<IAssessmentAttempt>(
  'AssessmentAttempt',
  assessmentAttemptSchema
);
