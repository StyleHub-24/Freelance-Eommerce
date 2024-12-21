import express from 'express';
import { addReview, listReviews, deleteReview } from '../controllers/reviewController.js';
import authUser from '../middleware/auth.js'

const reviewRouter = express.Router();

reviewRouter.post('/add', authUser, addReview);
reviewRouter.get('/:productId', listReviews);
reviewRouter.delete('/delete/:id', authUser, deleteReview);

export default reviewRouter;
