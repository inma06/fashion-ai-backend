import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IProduct extends Document {
  _id: Types.ObjectId;
  name: string;
  price: number;
  image: string;
  category: string;
  sizes: string[];
  description: string;
  color: string;
  brand: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  image: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['women', 'men', 'accessories']
  },
  sizes: [{
    type: String,
    required: true
  }],
  description: {
    type: String,
    required: true
  },
  color: {
    type: String,
    required: true
  },
  brand: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.model<IProduct>('Product', ProductSchema); 