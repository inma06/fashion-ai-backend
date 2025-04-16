import mongoose, { Document, Schema, Types } from 'mongoose';
import { IProduct } from './Product';
import { IUser } from './User';

export interface ICartItem {
  product: Types.ObjectId;
  quantity: number;
  size: string;
  price: number;
}

export interface ICart extends Document {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  items: ICartItem[];
  total: number;
  createdAt: Date;
  updatedAt: Date;
}

const CartSchema: Schema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [{
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    size: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    }
  }],
  total: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Calculate total before saving
CartSchema.pre('save', function(this: ICart, next: (err?: Error) => void) {
  this.total = this.items.reduce((total: number, item: ICartItem) => {
    return total + (item.price * item.quantity);
  }, 0);
  next();
});

export default mongoose.model<ICart>('Cart', CartSchema); 