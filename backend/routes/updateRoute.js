import express from 'express';
import { updateProduct } from '../controllers/updateController.js';
import adminAuth from '../middleware/adminAuth.js';
import upload from '../middleware/multer.js';
const updateRouter = express.Router();

// Update product route
updateRouter.put('/update', adminAuth , updateProduct);

export {updateRouter};
