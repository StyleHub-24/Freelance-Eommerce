import productModel from '../models/productModel.js';

const updateProduct = async (req, res) => {
    try {
        const {
            id,
            name,
            description,
            price,
            category,
            subCategory,
            sizes,
            bestseller,
            colorVariants
        } = req.body;

        // Validate if the product exists
        const product = await productModel.findById(id);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found!" });
        }

        // Update fields using ternary operators
        product.name = name ? name : product.name;
        product.description = description ? description : product.description;
        product.price = price ? Number(price) : product.price;
        product.category = category ? category : product.category;
        product.subCategory = subCategory ? subCategory : product.subCategory;
        product.sizes = sizes ? JSON.parse(sizes) : product.sizes;
        product.bestseller = typeof bestseller === 'string' 
            ? (bestseller === 'true' ? true : bestseller === 'false' ? false : product.bestseller)
            : product.bestseller;

        // Update stock in colorVariants while keeping other properties unchanged
        product.colorVariants = colorVariants && Array.isArray(colorVariants)
            ? product.colorVariants.map((variant) => {
                const updatedVariant = colorVariants.find(v => v.color === variant.color);
                return {
                    ...variant,
                    stock: updatedVariant ? updatedVariant.stock : variant.stock,
                };
            })
            : product.colorVariants;
            

        // Save updated product to the database
        await product.save();

        res.json({ success: true, message: "Product updated successfully!", product });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

export { updateProduct };
