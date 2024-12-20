import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'product' },
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    userName: { type: String, required: true },
    rating: { type: Number, required: true },
    content: { type: String, required: true },
    date: { type: Number, default: Date.now }
});

const reviewModel = mongoose.models.review || mongoose.model('review', reviewSchema);

export default reviewModel;
