import mongoose, { Document, Schema, Types } from 'mongoose';
import { IUser } from './User';
import { IProduct } from './Product';

export interface IOrderItem {
  product: Types.ObjectId;
  quantity: number;
  size: string;
  price: number;
}

export interface IOrder extends Document {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  items: IOrderItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
  paymentMethod: 'credit_card' | 'paypal';
  paymentStatus: 'pending' | 'completed' | 'failed';
  trackingNumber?: string;
  estimatedDelivery?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema: Schema = new Schema({
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
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  shippingAddress: {
    street: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    country: {
      type: String,
      required: true
    },
    zipCode: {
      type: String,
      required: true
    }
  },
  paymentMethod: {
    type: String,
    enum: ['credit_card', 'paypal'],
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  trackingNumber: {
    type: String
  },
  estimatedDelivery: {
    type: Date
  }
}, {
  timestamps: true
});

export default mongoose.model<IOrder>('Order', OrderSchema); 