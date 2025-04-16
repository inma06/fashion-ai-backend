import mongoose, { Document, Schema, Types } from 'mongoose';
import { IProduct } from './Product';
import { IUser } from './User';

export interface IReview extends Document {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  product: Types.ObjectId;
  rating: number;
  title: string;
  comment: string;
  images?: string[];
  likes: number;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema: Schema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  comment: {
    type: String,
    required: true,
    trim: true
  },
  images: [{
    type: String
  }],
  likes: {
    type: Number,
    default: 0
  },
  verified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Ensure one review per user per product
ReviewSchema.index({ user: 1, product: 1 }, { unique: true });

export default mongoose.model<IReview>('Review', ReviewSchema); 