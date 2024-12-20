import { v2 as cloudinary } from 'cloudinary';
import productModel from '../models/productModel.js';

// function for add product
const addProduct = async (req, res) => {
    try {

        const { name, description, price, category, subCategory, sizes, bestseller } = req.body

        const image1 = req.files.image1 && req.files.image1[0]
        const image2 = req.files.image2 && req.files.image2[0]
        const image3 = req.files.image3 && req.files.image3[0]
        const image4 = req.files.image4 && req.files.image4[0]
        // now we have to store the images in cloudinary
        const images = [image1, image2, image3, image4].filter((item) => item !== undefined)

        let imagesUrl = await Promise.all(
            images.map(async (item) => {
                let result = await cloudinary.uploader.upload(item.path, { resource_type: "image" });
                return result.secure_url;
            })
        )

        // console.log(name, description, price, category, subCategory, sizes, bestseller);
        // console.log(image1, image2, image3, image4);
        // console.log(images);
        // console.log(imagesUrl);

        // now save to mongodb 
        const productData = {
            name,
            description,
            price: Number(price),
            category,
            subCategory,
            sizes: JSON.parse(sizes),
            bestseller: bestseller === 'true' ? true : false,
            image: imagesUrl,
            date: Date.now()
        }

        // console.log(productData);

        const product = new productModel(productData);
        await product.save();

        res.json({ success: true, message: "Product added successfully!" })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

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
            return res.json({ success: false, message: "Product not found!" })
        }
        const publicIds = product.image.map((url) => {
            const parts = url.split('/');
            const lastPart = parts[parts.length - 1];
            return lastPart.split('.')[0];
        })
        await Promise.all(
            publicIds.map(async (publicId) => {
                await cloudinary.uploader.destroy(publicId);
            })
        );
        await productModel.findByIdAndDelete(id);
        res.json({ success: true, message: "Product removed successfully!" })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

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

