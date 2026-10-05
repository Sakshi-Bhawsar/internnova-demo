import mongoose, { Document, Schema } from 'mongoose';
import { InquiryType } from '../types/enums';

export interface IContactInquiry extends Document {
  type: InquiryType;
  name: string;
  email: string;
  subject?: string;
  message: string;
  companyName?: string;
  isResolved: boolean;
  resolvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const contactInquirySchema = new Schema<IContactInquiry>(
  {
    type: {
      type: String,
      enum: Object.values(InquiryType),
      default: InquiryType.CONTACT,
      index: true,
    },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    subject: { type: String, trim: true },
    message: { type: String, required: true },
    companyName: { type: String, trim: true },
    isResolved: { type: Boolean, default: false, index: true },
    resolvedAt: { type: Date },
  },
  { timestamps: true }
);

export const ContactInquiry = mongoose.model<IContactInquiry>(
  'ContactInquiry',
  contactInquirySchema
);
