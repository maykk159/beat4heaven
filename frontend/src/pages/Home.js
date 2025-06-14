import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Music, Star, TrendingUp, Users } from 'lucide-react';
import AlbumCard from '../components/AlbumCard';
import ReviewCard from '../components/ReviewCard';
import { albumsAPI, reviewsAPI, artistsAPI } from '../services/api';

const Home = () => {
  const [featuredAlbums, setFeaturedAlbums] = useState([]);
  const [recentReviews, setRecentReviews] = useState([]);
  const [stats, setStats] = useState({
    totalAlbums: 0,
    totalArtists: 0,
    totalReviews: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      setLoading(true);
      
      // Fetch featured albums (top rated)
      const albumsResponse = await albumsAPI.getAll({ ordering: '-average_rating' });
      setFeaturedAlbums(albumsResponse.data.slice(0, 6));
      
      // Fetch recent reviews
      const reviewsResponse = await reviewsAPI.getAll({ ordering: '-created_at' });
      setRecentReviews(reviewsResponse.data.slice(0, 5));
      
      // Fetch stats
      const artistsResponse = await artistsAPI.getAll();
      
      setStats({
        totalAlbums: albumsResponse.data.length,
        totalArtists: artistsResponse.data.length,
        totalReviews: reviewsResponse.data.length
      });
      
    } catch (error) {
      console.error('Error fetching home data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-4">
              Discover & Review Music
            </h1>
            <p className="text-xl mb-8 opacity-90">
              Share your thoughts on your favorite albums and discover new music
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/albums"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Browse Albums
              </Link>
              <Link
                to="/artists"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
              >
                Explore Artists
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Music className="text-blue-600" size={32} />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-2">{stats.totalAlbums}</h3>
            <p className="text-gray-600">Albums</p>
          </div>
          
          <div className="text-center">
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="text-purple-600" size={32} />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-2">{stats.totalArtists}</h3>
            <p className="text-gray-600">Artists</p>
          </div>
          
          <div className="text-center">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="text-green-600" size={32} />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-2">{stats.totalReviews}</h3>
            <p className="text-gray-600">Reviews</p>
          </div>
        </div>
      </div>

      {/* Featured Albums Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Featured Albums</h2>
          <Link
            to="/albums"
            className="text-blue-600 hover:text-blue-800 font-semibold flex items-center space-x-1"
          >
            <span>View All</span>
            <TrendingUp size={20} />
          </Link>
        </div>
        
        {featuredAlbums.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {featuredAlbums.map(album => (
              <AlbumCard key={album.id} album={album} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Music size={48} className="text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">No albums available yet</p>
            <p className="text-gray-500">Check back later for featured content</p>
          </div>
        )}
      </div>

      {/* Recent Reviews Section */}
      <div className="bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Recent Reviews</h2>
            <Link
              to="/reviews"
              className="text-blue-600 hover:text-blue-800 font-semibold"
            >
              View All Reviews
            </Link>
          </div>
          
          {recentReviews.length > 0 ? (
            <div className="space-y-6">
              {recentReviews.map(review => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Star size={48} className="text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">No reviews yet</p>
              <p className="text-gray-500">Be the first to review an album!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;