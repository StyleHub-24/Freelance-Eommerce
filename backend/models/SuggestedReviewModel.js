import mongoose from 'mongoose';

const suggestedReviewSchema = new mongoose.Schema(
  {
    subcategory: {
      type: String,
      required: true,
      unique: true, // Ensure each subcategory is unique
      trim: true,
    },
    messages: {
      type: [String], // Array of messages
      required: true,
      validate: {
        validator: function (v) {
          return v.length > 0; // Ensure there is at least one message
        },
        message: 'Messages array cannot be empty',
      },
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

const SuggestedReview = mongoose.model('SuggestedReview', suggestedReviewSchema);

export default SuggestedReview;
