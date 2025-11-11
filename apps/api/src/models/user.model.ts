import { Schema, model, type Document, type Types } from 'mongoose';

export interface UserPrefs {
  categories: string[];
  priceRange?: {
    min: number;
    max: number;
  };
}

export interface CartItem {
  product: Types.ObjectId;
  quantity: number;
}

export interface UserDocument extends Document {
  email: string;
  passwordHash: string;
  name: string;
  prefs: UserPrefs;
  createdAt: Date;
  updatedAt: Date;
  isAdmin: boolean;
  favorites: Types.ObjectId[];
  cart: CartItem[];
}

const userSchema = new Schema<UserDocument>(
  {
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String, required: true },
    name: { type: String, required: true },
    prefs: {
      categories: { type: [String], default: [] },
      priceRange: {
        min: { type: Number },
        max: { type: Number }
      }
    },
    favorites: [{ type: Schema.Types.ObjectId, ref: 'Product', default: [] }],
    cart: [
      {
        product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, default: 1, min: 1 }
      }
    ],
    isAdmin: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export const UserModel = model<UserDocument>('User', userSchema);
