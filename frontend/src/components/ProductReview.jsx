import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { toast } from 'react-toastify';

const ProductReviews = ({ productId }) => {
  const [newReview, setNewReview] = useState('');
  const [rating, setRating] = useState(5);
  const [reviews, setReviews] = useState([]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:4000/api/review/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          rating,
          content: newReview
        })
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Review submited sucessfully!")
        setNewReview('');
        setRating(5);
        fetchReviews(); // Refetch reviews after submitting a new one
      } else {
        toast.error("Enter something in the comment...");
        console.log(result.message)
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      // alert('An error occurred while submitting the review.');
      toast.error('An error occurred while submitting the review.')
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await fetch(`http://localhost:4000/api/review/${productId}`);
      const result = await response.json();
      console.log(reviews)

      if (result.success) {
        setReviews(result.reviews);
      } else {
        console.log('Failed to fetch reviews:', result.message);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  return (
    <div className="border p-6">
      {/* New Review Form */}
      <form onSubmit={handleSubmitReview} className="mb-8">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
          <div className="flex gap-1 mb-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-6 h-6 cursor-pointer ${
                  star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                }`}
                onClick={() => setRating(star)}
              />
            ))}
          </div>
          <label htmlFor="review" className="block text-sm font-medium text-gray-700 mb-2">
            Your Review
          </label>
          <textarea
            id="review"
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            value={newReview}
            onChange={(e) => setNewReview(e.target.value)}
            placeholder="Share your thoughts about this product..."
          />
        </div>
        <button
          type="submit"
          className="bg-black text-white py-2 px-6 text-sm hover:bg-gray-800 transition-colors"
        >
          Submit Review
        </button>
      </form>

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.map((review) => (
          <div key={review._id} className="border-b border-gray-200 pb-6">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-semibold">{review.userName}</h3>
                <div className="flex items-center mt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <span className="text-sm text-gray-500">{new Date(review.date).toLocaleDateString()}</span>
            </div>
            <p className="text-gray-600 mt-2">{review.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductReviews;
