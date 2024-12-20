import express from 'express';
import { addReview, listReviews } from '../controllers/reviewController.js';
import adminAuth from '../middleware/adminAuth.js';

const reviewRouter = express.Router();

reviewRouter.post('/add', addReview);
reviewRouter.get('/:productId', listReviews);

export default reviewRouter;
