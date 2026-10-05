import mongoose, { Document, Schema, Types } from 'mongoose';
import { CertificateStatus } from '../types/enums';

export interface ICertificate extends Document {
  certificateId: string;
  student: Types.ObjectId;
  internship: Types.ObjectId;
  evaluation?: Types.ObjectId;
  studentName: string;
  programName: string;
  startDate: Date;
  endDate: Date;
  skills: string[];
  projectTitle: string;
  overallScore: number;
  status: CertificateStatus;
  issuedAt: Date;
  revokedAt?: Date;
  revokeReason?: string;
  verificationUrl: string;
  isDemoSeed?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const certificateSchema = new Schema<ICertificate>(
  {
    certificateId: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    student: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    internship: { type: Schema.Types.ObjectId, ref: 'Internship', required: true },
    evaluation: { type: Schema.Types.ObjectId, ref: 'Evaluation' },
    studentName: { type: String, required: true },
    programName: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    skills: [{ type: String }],
    projectTitle: { type: String, required: true },
    overallScore: { type: Number, required: true, min: 0, max: 100 },
    status: {
      type: String,
      enum: Object.values(CertificateStatus),
      default: CertificateStatus.VALID,
      index: true,
    },
    issuedAt: { type: Date, default: Date.now },
    revokedAt: { type: Date },
    revokeReason: { type: String },
    verificationUrl: { type: String, required: true },
    isDemoSeed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Certificate = mongoose.model<ICertificate>('Certificate', certificateSchema);
