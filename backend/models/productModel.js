import mongoose from "mongoose";

const colorVariantSchema = new mongoose.Schema({
    color: { type: String, required: true },
    images: { type: Array, required: true },
    sizes: { type: Array, required: true },  // Sizes available for this color
    stock: { type: Number, required: true, default: 0 }  // Add stock field
});

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    subCategory: { type: String, required: true },
    colorVariants: [colorVariantSchema],  // Array of color variants
    bestseller: { type: Boolean, },
    date: { type: Number, required: true },
})

const productModel = mongoose.models.product || mongoose.model("product", productSchema);

export default productModel;