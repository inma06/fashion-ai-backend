import { Request, Response } from 'express';
import Review from '../models/Review';
import Order from '../models/Order';

export const createReview = async (req: Request, res: Response) => {
  try {
    const { productId, rating, title, comment, images } = req.body;

    // Check if user has purchased the product
    const order = await Order.findOne({
      user: req.user.userId,
      'items.product': productId,
      status: 'delivered'
    });

    if (!order) {
      return res.status(400).json({ message: 'You can only review products you have purchased' });
    }

    // Check if user has already reviewed this product
    const existingReview = await Review.findOne({
      user: req.user.userId,
      product: productId
    });

    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this product' });
    }

    const review = new Review({
      user: req.user.userId,
      product: productId,
      rating,
      title,
      comment,
      images,
      verified: true
    });

    await review.save();
    await review.populate('user', 'firstName lastName');

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: 'Error creating review', error });
  }
};

export const getProductReviews = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const { sort = 'createdAt', order = 'desc' } = req.query;

    const reviews = await Review.find({ product: productId })
      .populate('user', 'firstName lastName')
      .sort({ [sort as string]: order === 'desc' ? -1 : 1 });

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reviews', error });
  }
};

export const updateReview = async (req: Request, res: Response) => {
  try {
    const { rating, title, comment, images } = req.body;

    const review = await Review.findOne({
      _id: req.params.id,
      user: req.user.userId
    });

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    review.rating = rating;
    review.title = title;
    review.comment = comment;
    review.images = images;

    await review.save();
    await review.populate('user', 'firstName lastName');

    res.json(review);
  } catch (error) {
    res.status(500).json({ message: 'Error updating review', error });
  }
};

export const deleteReview = async (req: Request, res: Response) => {
  try {
    const review = await Review.findOne({
      _id: req.params.id,
      user: req.user.userId
    });

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    await review.deleteOne();
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting review', error });
  }
};

export const likeReview = async (req: Request, res: Response) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    review.likes += 1;
    await review.save();

    res.json(review);
  } catch (error) {
    res.status(500).json({ message: 'Error liking review', error });
  }
}; 