import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  category: string;
  usdPrice: number;
  pkrPrice: number;
  img: string;
  description: string;
  artisan: string;
  createdAt: Date;
}

const ProductSchema: Schema = new Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  usdPrice: { type: Number, required: true },
  pkrPrice: { type: Number, required: true },
  img: { type: String, required: true },
  description: { type: String, required: true },
  artisan: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Avoid overwriting model in development hot-reloads
export const Product: Model<IProduct> = mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);
