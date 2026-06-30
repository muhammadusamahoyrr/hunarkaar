import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IBespokeInquiry extends Document {
  craft: string;
  dimensions: string;
  userName: string;
  userEmail: string;
  userWhatsApp: string;
  status: string;
  createdAt: Date;
}

const BespokeInquirySchema: Schema = new Schema({
  craft: { type: String, required: true },
  dimensions: { type: String, required: true },
  userName: { type: String, required: true },
  userEmail: { type: String, required: true },
  userWhatsApp: { type: String, required: true },
  status: { type: String, default: 'Pending' },
  createdAt: { type: Date, default: Date.now }
});

export const BespokeInquiry: Model<IBespokeInquiry> = mongoose.models.BespokeInquiry || mongoose.model<IBespokeInquiry>('BespokeInquiry', BespokeInquirySchema);
