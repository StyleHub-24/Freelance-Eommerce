import productModel from '../models/productModel.js';

const updateProduct = async (req, res) => {
    try {
        // Extract data from the request body
        const {
            id,
            name,
            description,
            price,
            category,
            subCategory,
            sizes,
            bestseller
        } = req.body;

        // Validate if the product exists
        const product = await productModel.findById(id);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found!" });
        }

        // Update product fields
        product.name = name || product.name;
        product.description = description || product.description;
        product.price = price ? Number(price) : product.price;
        product.category = category || product.category;
        product.subCategory = subCategory || product.subCategory;
        product.sizes = sizes ? JSON.parse(sizes) : product.sizes;
        product.bestseller = bestseller === 'true' ? true : bestseller === 'false' ? false : product.bestseller;

        // Save updated product to database
        await product.save();

        res.json({ success: true, message: "Product updated successfully!", product });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

export { updateProduct };
