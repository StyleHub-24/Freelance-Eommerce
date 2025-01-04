import { v2 as cloudinary } from 'cloudinary';
import productModel from '../models/productModel.js';

// function for add product
const addProduct = async (req, res) => {
    try {
        const { 
            name, 
            description, 
            price, 
            category, 
            subCategory, 
            colorVariants, // This will be an array of {color, sizes, stock} objects
            bestseller 
        } = req.body;

        // Process images for each color variant
        const processedColorVariants = await Promise.all(
            JSON.parse(colorVariants).map(async (variant, index) => {
                // Get images for this color variant
                const variantImages = [];
                for (let i = 1; i <= 4; i++) {
                    const imageKey = `image${index}_${i}`;
                    if (req.files[imageKey] && req.files[imageKey][0]) {
                        variantImages.push(req.files[imageKey][0]);
                    }
                }

                // Upload images to cloudinary
                const imagesUrl = await Promise.all(
                    variantImages.map(async (item) => {
                        let result = await cloudinary.uploader.upload(item.path, { 
                            resource_type: "image"
                        });
                        return result.secure_url;
                    })
                );

                return {
                    color: variant.color,
                    images: imagesUrl,
                    sizes: variant.sizes,
                    stock: parseInt(variant.stock) || 0  
                };
            })
        );

        // Create product data
        const productData = {
            name,
            description,
            price: Number(price),
            category,
            subCategory,
            colorVariants: processedColorVariants,
            bestseller: bestseller === 'true',
            date: Date.now()
        };

        const product = new productModel(productData);
        await product.save();

        res.json({ success: true, message: "Product added successfully!" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// function for list products
const listProducts = async (req, res) => {
    try {

        const products = await productModel.find({});
        res.json({ success: true, products })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

// function for removing product
const removeProduct = async (req, res) => {
    try {
        const id = req.body.id;
        const product = await productModel.findById(id);
        
        if (!product) {
            return res.json({ success: false, message: "Product not found!" });
        }

        // Get all image URLs from all color variants
        const allImageUrls = product.colorVariants.flatMap(variant => variant.images);
        
        // Delete all images from cloudinary
        const publicIds = allImageUrls.map((url) => {
            const parts = url.split('/');
            const lastPart = parts[parts.length - 1];
            return lastPart.split('.')[0];
        });

        await Promise.all(
            publicIds.map(async (publicId) => {
                await cloudinary.uploader.destroy(publicId);
            })
        );

        await productModel.findByIdAndDelete(id);
        res.json({ success: true, message: "Product removed successfully!" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// function for single product info
const singleProduct = async (req, res) => {
    try {

        const { productId } = req.body
        const product = await productModel.findById(productId)
        res.json({ success: true, product })


    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

export { listProducts, addProduct, removeProduct, singleProduct }

