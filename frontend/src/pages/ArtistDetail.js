import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Music, Calendar, Disc, Loader } from 'lucide-react';
import AlbumCard from '../components/AlbumCard';
import { artistsAPI } from '../services/api';

const ArtistDetail = () => {
  const { id } = useParams();
  const [artist, setArtist] = useState(null);
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchArtistDetails();
    fetchArtistAlbums();
  }, [id]);

  const fetchArtistDetails = async () => {
    try {
      const data = await artistsAPI.getById(id);
      setArtist(data);
    } catch (err) {
      setError('Failed to load artist details');
    }
  };

  const fetchArtistAlbums = async () => {
    try {
      const data = await artistsAPI.getAlbums(id);
      setAlbums(data);
    } catch (err) {
      console.error('Failed to load artist albums');
    } finally {
      setLoading(false);
    }
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

  if (!artist) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Artist not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Artist Header */}
      <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-shrink-0">
            <div className="w-48 h-48 bg-gray-200 rounded-full flex items-center justify-center">
              <Music className="w-24 h-24 text-gray-400" />
            </div>
          </div>
          
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{artist.name}</h1>
            
            <div className="flex items-center mb-4">
              <span className="text-gray-600 mr-2">Genre:</span>
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                {artist.genre}
              </span>
            </div>
            
            <div className="flex items-center mb-6">
              <Disc className="w-5 h-5 text-gray-500 mr-2" />
              <span className="text-gray-600">{albums.length} albums</span>
            </div>
            
            {artist.bio && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Biography</h3>
                <p className="text-gray-600 leading-relaxed">{artist.bio}</p>
              </div>
            )}
            
            {artist.formed_date && (
              <div className="flex items-center text-gray-500">
                <Calendar className="w-4 h-4 mr-2" />
                <span>Formed: {artist.formed_date}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Albums Section */}
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <Disc className="w-6 h-6 mr-2 text-blue-600" />
          Albums
        </h2>
        
        {albums.length === 0 ? (
          <div className="text-center py-12">
            <Disc className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No albums found</p>
            <p className="text-gray-400">This artist hasn't released any albums yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {albums.map(album => (
              <AlbumCard key={album.id} album={album} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ArtistDetail;