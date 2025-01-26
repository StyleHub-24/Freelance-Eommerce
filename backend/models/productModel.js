import mongoose from "mongoose";

const sizeSchema = new mongoose.Schema({
    size: { type: String, required: true },
    stock: { type: Number, required: true, default: 0 },
    chestMeasurements: {
        inches: { type: String, required: true }, // e.g., "34-37"
        cm: { type: String, required: true }      // e.g., "86-94"
    }
});

const colorVariantSchema = new mongoose.Schema({
    color: { type: String, required: true },
    images: { type: Array, required: true },
    price: { type: Number, required: true },
    sizes: [sizeSchema]  // Array of size objects with stock and measurements
});

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    subCategory: { type: String, required: true },
    colorVariants: [colorVariantSchema],  // Array of color variants
    bestseller: { type: Boolean, },
    date: { type: Number, required: true },
})

const productModel = mongoose.models.product || mongoose.model("product", productSchema);

export default productModel;