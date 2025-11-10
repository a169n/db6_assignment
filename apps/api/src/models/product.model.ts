import { Schema, model, type Document } from 'mongoose';

export interface ProductDocument extends Document {
  name: string;
  slug: string;
  description: string;
  category: string;
  price: number;
  images: string[];
  createdAt: Date;
}

const productSchema = new Schema<ProductDocument>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    description: { type: String, required: true },
    category: { type: String, required: true, index: true },
    price: { type: Number, required: true, index: true },
    images: { type: [String], default: [] }
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

productSchema.index({ category: 1, price: 1 });
productSchema.index({ name: 'text', description: 'text' });

export const ProductModel = model<ProductDocument>('Product', productSchema);
