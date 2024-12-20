import reviewModel from '../models/reviewModel.js';
import userModel from "../models/userModel.js"; // Import the user model

// Function to add a review
const addReview = async (req, res) => {
    try {
        const { rating, content, userId , productId } = req.body;

        // Find the user by id from the request
        const user = await userModel.findById(userId);
        // console.log(user.name);
        
        // Check if user exists
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Create the review data with the user ID and name
        const reviewData = {
            productId: productId,
            userId: user._id,
            userName: user.name, // Include the user's name
            rating: Number(rating),
            content,
            date: Date.now()
        };
        // console.log(reviewData.productId)
        const review = new reviewModel(reviewData);
        await review.save();

        res.json({ success: true, message: 'Review added successfully!', review });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Function to list reviews for a specific product
const listReviews = async (req, res) => {
    try {
        const { productId } = req.params;
        const reviews = await reviewModel.find({ productId }).populate('userId', 'name'); // Populate user details from userId
        res.json({ success: true, reviews });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export { addReview, listReviews };
