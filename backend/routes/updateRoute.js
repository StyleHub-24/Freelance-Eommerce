import express from 'express';
import { updateProduct } from '../controllers/updateController.js';
import adminAuth from '../middleware/adminAuth.js';
import upload from '../middleware/multer.js';
const updateRouter = express.Router();

// Update product route
updateRouter.put('/update', upload.fields([{ name: 'image1', maxCount: 1 }, { name: 'image2', maxCount: 1 }, { name: 'image3', maxCount: 1 }, { name: 'image4', maxCount: 1 }]),updateProduct);

export {updateRouter};
