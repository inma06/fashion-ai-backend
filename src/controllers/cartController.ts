import { Request, Response } from 'express';
import Cart from '../models/Cart';
import Product from '../models/Product';

export const getCart = async (req: Request, res: Response) => {
  try {
    let cart = await Cart.findOne({ user: req.user.userId })
      .populate('items.product');
    
    if (!cart) {
      cart = new Cart({ user: req.user.userId, items: [] });
      await cart.save();
    }
    
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cart', error });
  }
};

export const addToCart = async (req: Request, res: Response) => {
  try {
    const { productId, quantity, size } = req.body;

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if size is available
    if (!product.sizes.includes(size)) {
      return res.status(400).json({ message: 'Size not available' });
    }

    let cart = await Cart.findOne({ user: req.user.userId });
    
    if (!cart) {
      cart = new Cart({
        user: req.user.userId,
        items: [{
          product: productId,
          quantity,
          size,
          price: product.price
        }]
      });
    } else {
      // Check if product already in cart
      const existingItem = cart.items.find(
        item => item.product.toString() === productId && item.size === size
      );

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.items.push({
          product: productId,
          quantity,
          size,
          price: product.price
        });
      }
    }

    await cart.save();
    await cart.populate('items.product');
    
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Error adding to cart', error });
  }
};

export const updateCartItem = async (req: Request, res: Response) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;

    const cart = await Cart.findOne({ user: req.user.userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const item = cart.items.id(itemId);
    if (!item) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    item.quantity = quantity;
    await cart.save();
    await cart.populate('items.product');

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Error updating cart item', error });
  }
};

export const removeFromCart = async (req: Request, res: Response) => {
  try {
    const { itemId } = req.params;

    const cart = await Cart.findOne({ user: req.user.userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = cart.items.filter(item => item._id.toString() !== itemId);
    await cart.save();
    await cart.populate('items.product');

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Error removing from cart', error });
  }
};

export const clearCart = async (req: Request, res: Response) => {
  try {
    const cart = await Cart.findOne({ user: req.user.userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = [];
    await cart.save();

    res.json({ message: 'Cart cleared successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error clearing cart', error });
  }
}; 