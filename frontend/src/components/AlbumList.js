import React, { useEffect, useState } from 'react';
import { albumsAPI } from '../services/api';
import AlbumCard from './AlbumCard';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

const AlbumList = () => {
  const [albums, setAlbums] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAlbums = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching albums...');
      const response = await albumsAPI.getAll();
      console.log('Albums data received:', response.data);
      if (Array.isArray(response.data)) {
        setAlbums(response.data);
      } else {
        console.error('Invalid data format received:', response.data);
        setError('Invalid data format received from server');
      }
    } catch (error) {
      console.error('Error fetching albums:', error);
      setError(error.message || 'Failed to load albums. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlbums();
  }, []);

  const filteredAlbums = albums.filter(album =>
    album.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (album.artist_name && album.artist_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    album.genre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ mt: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Box sx={{ mt: 2 }}>Loading albums...</Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="xl" sx={{ mt: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Button 
            variant="contained" 
            onClick={fetchAlbums}
            sx={{ mr: 2 }}
          >
            Retry
          </Button>
          <Button 
            variant="outlined" 
            onClick={() => window.location.reload()}
          >
            Refresh Page
          </Button>
        </Box>
      </Container>
    );
  }

  if (albums.length === 0) {
    return (
      <Container maxWidth="xl" sx={{ mt: 4, textAlign: 'center' }}>
        <Alert severity="info">
          No albums found. Please try again later.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4 }}>
      <Box display="flex" justifyContent="center" mb={4}>
        <TextField
          fullWidth
          label="Search albums by title, artist or genre..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          variant="outlined"
          size="medium"
          sx={{ minWidth: 400, maxWidth: 900 }}
        />
      </Box>
      <Grid container spacing={3} justifyContent="center" alignItems="stretch">
        {filteredAlbums.map(album => (
          <Grid item key={album.id} xs={12} sm={6} md={4} lg={3} display="flex">
            <AlbumCard album={album} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default AlbumList;