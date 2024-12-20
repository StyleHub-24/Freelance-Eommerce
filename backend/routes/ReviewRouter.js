import express from 'express';
import { addReview, listReviews } from '../controllers/reviewController.js';
import authUser from '../middleware/auth.js'

const reviewRouter = express.Router();

reviewRouter.post('/add', authUser, addReview);
reviewRouter.get('/:productId', listReviews);

export default reviewRouter;
