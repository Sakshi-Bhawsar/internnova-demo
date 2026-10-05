import mongoose, { Document, Schema } from 'mongoose';

export interface ICertificateCounter extends Document {
  year: number;
  seq: number;
}

const certificateCounterSchema = new Schema<ICertificateCounter>(
  {
    year: { type: Number, required: true, unique: true },
    seq: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);

export const CertificateCounter = mongoose.model<ICertificateCounter>(
  'CertificateCounter',
  certificateCounterSchema
);

export async function nextCertificateId(): Promise<string> {
  const year = new Date().getFullYear();
  const counter = await CertificateCounter.findOneAndUpdate(
    { year },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  const seq = String(counter.seq).padStart(6, '0');
  return `UM-${year}-${seq}`;
}
