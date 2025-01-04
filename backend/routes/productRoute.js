import express from 'express';
import { listProducts, addProduct, removeProduct, singleProduct } from '../controllers/productController.js';
import upload from '../middleware/multer.js';
import adminAuth from '../middleware/adminAuth.js';

const productRouter = express.Router();

// Create dynamic upload fields based on maximum number of color variants and images per variant
const createUploadFields = (maxColorVariants = 5, maxImagesPerVariant = 4) => {
    const fields = [];
    for (let i = 0; i < maxColorVariants; i++) {
        for (let j = 1; j <= maxImagesPerVariant; j++) {
            fields.push({ name: `image${i}_${j}`, maxCount: 1 });
        }
    }
    return fields;
};

productRouter.get('/list', listProducts);
productRouter.post('/add', adminAuth, upload.fields(createUploadFields()), addProduct);
productRouter.post('/remove', adminAuth, removeProduct);
productRouter.post('/single', singleProduct);

export default productRouter;