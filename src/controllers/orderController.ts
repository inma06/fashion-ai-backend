import { Request, Response } from 'express';
import Order from '../models/Order';
import Cart from '../models/Cart';
import Product from '../models/Product';

export const createOrder = async (req: Request, res: Response) => {
  try {
    const { shippingAddress, paymentMethod } = req.body;

    // Get user's cart
    const cart = await Cart.findOne({ user: req.user.userId })
      .populate('items.product');
    
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Create order items from cart items
    const orderItems = cart.items.map(item => ({
      product: item.product._id,
      quantity: item.quantity,
      size: item.size,
      price: item.price
    }));

    // Create order
    const order = new Order({
      user: req.user.userId,
      items: orderItems,
      total: cart.total,
      shippingAddress,
      paymentMethod
    });

    await order.save();

    // Clear cart
    cart.items = [];
    await cart.save();

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error creating order', error });
  }
};

export const getOrders = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find({ user: req.user.userId })
      .populate('items.product')
      .sort({ createdAt: -1 });
    
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders', error });
  }
};

export const getOrderById = async (req: Request, res: Response) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user.userId
    }).populate('items.product');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching order', error });
  }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Only admin can update order status
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    order.status = status;
    await order.save();

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error updating order status', error });
  }
};

export const cancelOrder = async (req: Request, res: Response) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user.userId
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Only allow cancellation of pending orders
    if (order.status !== 'pending') {
      return res.status(400).json({ message: 'Cannot cancel non-pending order' });
    }

    order.status = 'cancelled';
    await order.save();

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error cancelling order', error });
  }
}; 