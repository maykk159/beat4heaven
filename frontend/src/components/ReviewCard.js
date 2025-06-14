import React, { useState, useEffect } from 'react';
import { Star, ThumbsUp, User } from 'lucide-react';
import { reviewsAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';

const ReviewCard = ({ review, onLike }) => {
  const [isLiking, setIsLiking] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const getLikeStatus = async () => {
      try {
        const response = await reviewsAPI.getLikeStatus(review.id);
        setLikeCount(response.data.like_count);
        setIsLiked(response.data.is_liked);
      } catch (error) {
        console.error('Error getting like status:', error);
      }
    };
    getLikeStatus();
  }, [review.id]);

  const getRatingStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star 
          key={i} 
          size={16} 
          className={i <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"} 
        />
      );
    }
    return stars;
  };

  const handleLike = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    if (isLiking) return;
    
    setIsLiking(true);
    try {
      const response = await reviewsAPI.like(review.id);
      setLikeCount(response.data.like_count);
      setIsLiked(response.data.status === 'liked');
      if (onLike) onLike();
    } catch (error) {
      console.error('Error liking review:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
      }
    } finally {
      setIsLiking(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
            <User size={20} className="text-gray-600" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">{review.username}</h4>
            <p className="text-sm text-gray-500">{formatDate(review.created_at)}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-1">
          {getRatingStars(review.rating)}
          <span className="ml-2 text-sm font-medium text-gray-700">
            {review.rating}/5
          </span>
        </div>
      </div>
      
      <div className="mb-4">
        <p className="text-gray-700 leading-relaxed">{review.review_text}</p>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">
          Review for: <span className="font-medium">{review.album_title}</span>
        </div>
        
        <button
        onClick={handleLike}
        disabled={isLiking}
        className={`flex items-center space-x-1 transition-colors disabled:opacity-50
          ${isLiked ? 'text-blue-600' : 'text-gray-500'} 
          hover:text-blue-600`}
      >
        <ThumbsUp size={16} className={isLiked ? 'fill-current' : ''} />
        <span className="text-sm">{likeCount}</span>
      </button>
      </div>
    </div>
  );
};

export default ReviewCard;