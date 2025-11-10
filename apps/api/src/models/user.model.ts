import { Schema, model, type Document } from 'mongoose';

export interface UserPrefs {
  categories: string[];
  priceRange?: {
    min: number;
    max: number;
  };
}

export interface UserDocument extends Document {
  email: string;
  passwordHash: string;
  name: string;
  prefs: UserPrefs;
  createdAt: Date;
  updatedAt: Date;
  isAdmin: boolean;
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
    isAdmin: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export const UserModel = model<UserDocument>('User', userSchema);
