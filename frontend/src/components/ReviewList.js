import React, { useEffect, useState } from 'react';
import { reviewsAPI } from '../services/api';
import ReviewCard from './ReviewCard';

const ReviewList = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await reviewsAPI.getAll();
      setReviews(response.data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setError('Failed to load reviews. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  if (loading) {
    return <div className="text-center p-4">Loading reviews...</div>;
  }

  if (error) {
    return <div className="text-red-600 p-4">{error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Reviews</h2>
      {reviews.length === 0 ? (
        <p className="text-gray-500 text-center">No reviews found.</p>
      ) : (
        <div className="space-y-6">
          {reviews.map(review => (
            <ReviewCard
              key={review.id}
              review={{
                id: review.id,
                username: review.user?.username || review.username,
                rating: review.rating,
                review_text: review.text || review.content,
                created_at: review.created_at,
                album_title: review.album?.title || review.album
              }}
              onLike={fetchReviews}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewList;