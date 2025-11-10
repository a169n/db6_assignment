import { Schema, model, type Document, Types } from 'mongoose';

export type InteractionType = 'view' | 'like' | 'purchase';

export interface InteractionDocument extends Document {
  userId: Types.ObjectId;
  productId: Types.ObjectId;
  type: InteractionType;
  weight: number;
  createdAt: Date;
}

const interactionSchema = new Schema<InteractionDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', index: true, required: true },
    productId: { type: Schema.Types.ObjectId, ref: 'Product', index: true, required: true },
    type: { type: String, enum: ['view', 'like', 'purchase'], required: true },
    weight: { type: Number, required: true }
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

interactionSchema.index({ userId: 1, productId: 1 });
interactionSchema.index({ productId: 1 });

export const InteractionModel = model<InteractionDocument>('Interaction', interactionSchema);
