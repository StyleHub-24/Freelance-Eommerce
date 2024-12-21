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

// Function to delete a review
const deleteReview = async (req, res) => {
    // console.log("Authenticated user:", req.user); // Log the user object

    const reviewId = req.params.id; // Review ID from the URL
    const { userId } = req.body; // Get the user ID from the authenticated user

    if (!userId) {
        return res.status(400).json({ success: false, message: 'User ID is missing.' });
    }

    // console.log("uid: " + userId); // Logs the actual user ID

    try {
        const review = await reviewModel.findById(reviewId);

        if (!review) {
            return res.status(404).json({ success: false, message: 'Review not found' });
        }

        // Check if the logged-in user owns the review
        if (review.userId.toString() !== userId) {
            return res.status(403).json({ success: false, message: 'You are not authorized to delete this review.' });
        }

        // Delete the review
        await review.deleteOne(); // Or review.remove()

        res.status(200).json({ success: true, message: 'Review deleted successfully.' });
    } catch (error) {
        console.error("Error during review deletion:", error);
        res.status(500).json({ success: false, message: 'Server error while deleting review.' });
    }
};

export { addReview, listReviews, deleteReview };
