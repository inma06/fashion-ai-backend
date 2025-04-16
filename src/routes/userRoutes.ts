import express from 'express';
import { register, login, getProfile, updateProfile, addToWishlist, removeFromWishlist } from '../controllers/userController';
import { auth } from '../middleware/auth';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/profile', auth, getProfile);
router.put('/profile', auth, updateProfile);
router.post('/wishlist/:productId', auth, addToWishlist);
router.delete('/wishlist/:productId', auth, removeFromWishlist);

export default router; 