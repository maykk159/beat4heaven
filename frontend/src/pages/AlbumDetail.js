import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, MessageCircle, Plus, Calendar, Music, User, Loader } from 'lucide-react';
import ReviewCard from '../components/ReviewCard';
import { albumsAPI, reviewsAPI } from '../services/api';

const AlbumDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [album, setAlbum] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAlbumDetails();
    fetchAlbumReviews();
  }, [id]);

  const fetchAlbumDetails = async () => {
    try {
      const data = await albumsAPI.getById(id);
      setAlbum(data);
    } catch (err) {
      setError('Failed to load album details');
    }
  };

  const fetchAlbumReviews = async () => {
    try {
      const data = await reviewsAPI.getByAlbum(id);
      setReviews(data);
    } catch (err) {
      console.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleReviewLike = async (reviewId) => {
    try {
      await reviewsAPI.like(reviewId);
      fetchAlbumReviews(); // Refresh reviews
    } catch (err) {
      console.error('Failed to like review');
    }
  };

  const handleWriteReview = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    navigate(`/albums/${album.id}/review`);
  };

  const getRatingStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />);
    }
    
    if (hasHalfStar) {
      stars.push(<Star key="half" className="w-5 h-5 text-yellow-400 fill-current opacity-50" />);
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-5 h-5 text-gray-300" />);
    }
    
    return stars;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 py-8">
        <p>{error}</p>
      </div>
    );
  }

  if (!album) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Album not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Album Header */}
      <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-shrink-0">
            <div className="w-64 h-64 bg-gray-200 rounded-lg flex items-center justify-center">
              <Music className="w-24 h-24 text-gray-400" />
            </div>
          </div>
          
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">{album.title}</h1>
            <Link 
              to={`/artists/${album.artist.id}`}
              className="text-xl text-blue-600 hover:text-blue-800 transition-colors mb-4 inline-flex items-center"
            >
              <User className="w-5 h-5 mr-2" />
              {album.artist.name}
            </Link>
            
            <div className="flex items-center mb-4">
              <Calendar className="w-5 h-5 text-gray-500 mr-2" />
              <span className="text-gray-600">{album.release_date}</span>
            </div>
            
            <div className="flex items-center mb-4">
              <span className="text-gray-600 mr-2">Genre:</span>
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                {album.genre}
              </span>
            </div>
            
            <div className="flex items-center mb-6">
              <div className="flex items-center mr-4">
                {getRatingStars(album.average_rating || 0)}
                <span className="ml-2 text-gray-600">
                  {album.average_rating ? album.average_rating.toFixed(1) : 'No ratings'}
                </span>
              </div>
              <div className="flex items-center text-gray-500">
                <MessageCircle className="w-4 h-4 mr-1" />
                <span>{reviews.length} reviews</span>
              </div>
            </div>
            
            <button
              onClick={handleWriteReview}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center"
            >
              <Plus className="w-5 h-5 mr-2" />
              Write a Review
            </button>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Reviews</h2>
        
        {reviews.length === 0 ? (
          <div className="text-center py-12">
            <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-4">No reviews yet</p>
            <p className="text-gray-400">Be the first to review this album!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {reviews.map(review => (
              <ReviewCard 
                key={review.id} 
                review={review} 
                onLike={handleReviewLike}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AlbumDetail;