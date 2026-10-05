import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IQuestion extends Document {
  assessment: Types.ObjectId;
  questionText: string;
  options: string[];
  correctOptionIndex: number;
  order: number;
  points: number;
  createdAt: Date;
  updatedAt: Date;
}

const questionSchema = new Schema<IQuestion>(
  {
    assessment: {
      type: Schema.Types.ObjectId,
      ref: 'Assessment',
      required: true,
      index: true,
    },
    questionText: { type: String, required: true },
    options: {
      type: [{ type: String, required: true }],
      validate: {
        validator: (v: string[]) => v.length >= 2,
        message: 'At least two options required',
      },
    },
    correctOptionIndex: { type: Number, required: true, select: false },
    order: { type: Number, default: 0 },
    points: { type: Number, default: 1, min: 1 },
  },
  { timestamps: true }
);

questionSchema.index({ assessment: 1, order: 1 });

export const Question = mongoose.model<IQuestion>('Question', questionSchema);
