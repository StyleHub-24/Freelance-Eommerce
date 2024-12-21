import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { toast } from 'react-toastify';
import { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';

const ProductReviews = ({ productId }) => {
  const [newReview, setNewReview] = useState('');
  const [rating, setRating] = useState(5);
  const [reviews, setReviews] = useState([]);
  const { token, backendUrl } = useContext(ShopContext); // Access the token from the context

  const decodeToken = (token) => {
    const base64Url = token.split('.')[1]; // Get the payload part
    const base64 = base64Url.replace('-', '+').replace('_', '/'); // Replace URL-safe characters with base64 characters
    const decoded = JSON.parse(atob(base64)); // Decode the base64 to JSON
    // console.log(decoded)
    return decoded;
  };

  // Check if the token is valid and user is authenticated also one thing that the user is not logged in they can view the reviews but they can't add or delete the reviews
  const isLoggedIn = token ? true : false;
  const decoded = isLoggedIn ? decodeToken(token).id : null;

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(backendUrl + '/api/review/add', {
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
        toast.success("Review submited sucessfully!")
        setNewReview('');
        setRating(5);
        fetchReviews(); // Refetch reviews after submitting a new one
      } else {
        toast.error(result.message);
        // console.log(result.message)
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      // alert('An error occurred while submitting the review.');
      toast.error('An error occurred while submitting the review.')
    }
  };

  const handleRemoveReview = async (reviewId) => {
    try {
      const response = await fetch(backendUrl + `/api/review/delete/${reviewId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          token, // Include the token in the request headers
        },
      });
  
      const result = await response.json();
  
      if (result.success) {
        toast.success("Review removed successfully!");
        fetchReviews(); // Refetch reviews after deleting one
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error('Error removing review:', error);
      toast.error('An error occurred while removing the review.');
    }
  };
  
  

  const fetchReviews = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/review/${productId}`);
      const result = await response.json();
      // console.log(reviews)

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
                className={`w-6 h-6 cursor-pointer ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
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
                      className={`w-4 h-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                        }`}
                    />
                  ))}
                </div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-sm text-gray-500">{new Date(review.date).toLocaleDateString()}</div>
                {decoded && decoded === review.userId &&(
                <div className="text-sm flex items-center justify-center h-6 w-6 bg-gray-200 rounded-full text-gray-500 cursor-pointer mt-2" onClick={() => handleRemoveReview(review._id)}>
                  X
                </div>
                )}
              </div>

            </div>
            <p className="text-gray-600 mt-2">{review.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductReviews;
