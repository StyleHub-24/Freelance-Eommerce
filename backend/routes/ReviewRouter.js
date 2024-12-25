import express from 'express';
import { addReview, listReviews, deleteReview, addSuggestedReview, showSuggestedReview } from '../controllers/reviewController.js';
import authUser from '../middleware/auth.js'
import adminAuth from '../middleware/adminAuth.js';

const reviewRouter = express.Router();

reviewRouter.post('/add', authUser, addReview);
reviewRouter.get('/:productId', listReviews);
reviewRouter.delete('/delete/:id', authUser, deleteReview);
reviewRouter.post('/add-suggested', adminAuth, addSuggestedReview);
reviewRouter.get('/show-suggested/:subCategory',  showSuggestedReview);
export default reviewRouter;
