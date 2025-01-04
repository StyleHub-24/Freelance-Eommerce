import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { toast } from 'react-toastify';
import { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { useNavigate } from 'react-router-dom';

const ProductReviews = ({ productId, subCategory }) => {
  const [newReview, setNewReview] = useState('');
  const [rating, setRating] = useState(5);
  const [reviews, setReviews] = useState([]);
  const { token, backendUrl } = useContext(ShopContext);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedReviewId, setSelectedReviewId] = useState(null);
  const [suggestedReviews, setSuggestedReviews] = useState([]);

  // const suggestedReviews = [
  //   "Amazing quality!",
  //   "Fast shipping and well-packaged.",
  //   "Exceeded my expectations!",
  //   "Good value for money.",
  //   "I would highly recommend this product."
  // ];
  const fetchSuggestedReviews = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/review/show-suggested/${subCategory}`);
      const result = await response.json();
      setSuggestedReviews(result.suggested[0].messages);
    } catch (error) {
      console.error("No suggested reviews", error);
    }
  };


  const decodeToken = (token) => {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(atob(base64));
  };
  const isLoggedIn = token ? true : false;
  const decoded = isLoggedIn ? decodeToken(token).id : null;

  const navigate = useNavigate();

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (decoded === null) {
      toast.warning("Please login first!");
      navigate('/login');
      setTimeout(() => {
        window.scrollTo(0, 0);
      }, 0);
      return;
    }

    try {
      const response = await fetch(`${backendUrl}/api/review/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          token
        },
        body: JSON.stringify({
          productId,
          rating,
          content: newReview
        })
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Review submitted successfully!");
        setNewReview('');
        setRating(5);
        fetchReviews();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('An error occurred while submitting the review.');
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setNewReview((prev) => `${prev} ${suggestion}`.trim());
  };

  const handleRemoveReview = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/review/delete/${selectedReviewId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          token
        },
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Review removed successfully!");
        fetchReviews();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error('Error removing review:', error);
      toast.error('An error occurred while removing the review.');
    }
    setShowPopup(false);
  };

  const fetchReviews = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/review/${productId}`);
      const result = await response.json();
      if (result.success) {
        setReviews(result.reviews);
      } else {
        console.log('Failed to fetch reviews:', result.message);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  // UseEffect to fetch reviews and suggested reviews on load
  useEffect(() => {
    fetchReviews();
    fetchSuggestedReviews(); // Fetch suggested reviews when the component mounts or subcategory changes
  }, [productId, subCategory]);

  return (
    <div className="border p-6">
      {/* Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 p-5 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg w-96">
            <h3 className="text-xl font-semibold mb-4 text-center">Confirm Deletion</h3>
            <p className="text-gray-600 text-center mb-6">Are you sure you want to remove this review?</p>
            <div className="flex justify-between">
              <button
                onClick={() => setShowPopup(false)}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleRemoveReview}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Review Form */}
      <form onSubmit={handleSubmitReview} className="mb-8">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
          <div className="flex gap-1 mb-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-6 h-6 cursor-pointer ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                  }`}
                onClick={() => setRating(star)}
              />
            ))}
          </div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Suggestions</label>
          <div className="flex flex-wrap gap-2 mb-4">
            {suggestedReviews.map((suggestion, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleSuggestionClick(suggestion)}
                className="bg-gray-200 text-gray-700 px-3 py-1 rounded hover:bg-gray-300"
              >
                {suggestion}
              </button>
            ))}
          </div>
          <label htmlFor="review" className="block text-sm font-medium text-gray-700 mb-2">Your Review</label>
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
              <div className="flex items-center">
                {/* User's Profile Picture */}
                <img
                  src={review.userId.profilePicture || 'default-image-url'}  // Provide a default image URL if profile picture is not available
                  alt={`${review.userId.name}'s profile`}
                  className="w-8 h-8 rounded-full object-cover mr-3"  // Circular image
                />
                <div>
                  <h3 className="font-semibold">{review.userId.name}</h3>
                  {/* Stars below the name and profile picture */}
                  <div className="flex items-center mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-sm text-gray-500">{new Date(review.date).toLocaleDateString()}</div>
                {decoded && decoded === review.userId._id && (
                  <div
                    className="text-sm flex items-center justify-center h-6 w-6 bg-gray-200 rounded-full text-gray-500 cursor-pointer mt-2"
                    onClick={() => { setSelectedReviewId(review._id); setShowPopup(true); }}
                  >
                    X
                  </div>
                )}
              </div>
            </div>
            {/* Review content */}
            <p className="text-gray-600 mt-2 max-w-full overflow-scroll">{review.content}</p> {/* Ensure content stays within boundaries */}
          </div>
        ))}
      </div>

    </div>
  );
};

export default ProductReviews;
