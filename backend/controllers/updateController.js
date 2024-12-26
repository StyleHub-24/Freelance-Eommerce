import { v2 as cloudinary } from 'cloudinary';
import productModel from '../models/productModel.js';

const updateProduct = async (req, res) => {
    try {
        // Extract data from the request body
        const { id, name, description, price, category, subCategory, sizes, bestseller, replacedImages } = req.body;
        // Ensure replacedImages is an array
        const replacedImagesArray = Array.isArray(replacedImages) ? replacedImages : JSON.parse(replacedImages || '[]');
        // Validate if the product exists
        const product = await productModel.findById(id);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found!" });
        }
        const imageUrls = product.image || []; // Get the current images from the product
        // Delete existing images from Cloudinary that are being replaced
        if (replacedImagesArray.length > 0) {
            const publicIdsToDelete = replacedImagesArray
                .filter((index) => imageUrls[index] && imageUrls[index] !== null) // Ensure URL is valid
                .map((index) => {
                    const url = imageUrls[index]; // Get the image URL using the index
                    product.image[index]=null;
                    if (url) {
                        const parts = url.split('/');
                        const fileName = parts[parts.length - 1];
                        return fileName.split('.')[0]; // Extract the public ID
                    }
                    return null; // If URL is invalid, return null
                })
                .filter((publicId) => publicId !== null); // Filter out any null values

            // Delete each image from Cloudinary
            await Promise.all(
                publicIdsToDelete.map(async (publicId) => {
                    await cloudinary.uploader.destroy(publicId);
                })
            );
        }

        // Extract new images from request files
        const image1 = req.files.image1 && req.files.image1[0];
        const image2 = req.files.image2 && req.files.image2[0];
        const image3 = req.files.image3 && req.files.image3[0];
        const image4 = req.files.image4 && req.files.image4[0];

        // Prepare an array of images to upload (filter out undefined images)
        const images = [image1, image2, image3, image4].filter((item) => item !== undefined);

        // Upload new images to Cloudinary and get URLs
        const imagesUrl = await Promise.all(
            images.map(async (item) => {
                const result = await cloudinary.uploader.upload(item.path, { resource_type: "image" });
                return result.secure_url;
            })
        );
        // Update product fields in the database
        product.name = name || product.name;
        product.description = description || product.description;
        product.price = price ? Number(price) : product.price;
        product.category = category || product.category;
        product.subCategory = subCategory || product.subCategory;
        product.sizes = sizes ? JSON.parse(sizes) : product.sizes;
        product.bestseller = bestseller === 'true' ? true : bestseller === 'false' ? false : product.bestseller;

        // Handle images: Replace old images with the new ones and add new images if needed
        // Ensure the replaced images are updated, and any new images are added
        product.image = imageUrls.map((url, index) => {
            if (replacedImagesArray.includes(index) && imagesUrl.length > 0) {
                return imagesUrl.shift(); // Replace with the new uploaded image
            }
            return url; // Keep the existing image if not replaced
        });

        // Add any new images that are uploaded (e.g., images for 3rd or 4th slots)
        if (imagesUrl.length > 0) {
            // Check if there are still empty image slots
            for (let i = 0; i < 4; i++) {
                if (!product.image[i] && imagesUrl.length > 0) {
                    product.image[i] = imagesUrl.shift(); // Add the new image to an empty slot
                }
            }
        }

        // Save updated product
        await product.save();

        res.json({ success: true, message: "Product updated successfully!", product });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

export { updateProduct };
