import React, { useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { Star, ThumbsUp, User, Image as ImageIcon, ChevronDown, ChevronUp } from 'lucide-react';
import { reviewsAPI } from '../services/api';
import ReviewForm from './ReviewForm';
import Modal from '@mui/material/Modal';
import Paper from '@mui/material/Paper';

const StarRating = ({ rating, size = 18 }) => (
  <Box display="flex" alignItems="center">
    {[...Array(5)].map((_, i) => (
      <Star
        key={i}
        size={size}
        style={{ color: i < rating ? '#FFD600' : '#E0E0E0', marginRight: 2 }}
        fill={i < rating ? 'currentColor' : 'none'}
      />
    ))}
    <Typography variant="body2" color="text.secondary" ml={1}>
      ({rating}/5)
    </Typography>
  </Box>
);

const AlbumCard = ({ album }) => {
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [showReviews, setShowReviews] = useState(false);
  const [showBioModal, setShowBioModal] = useState(false);

  const fetchReviews = async () => {
    try {
      const response = await reviewsAPI.getAlbumReviews(album.id);
      setReviews(response.data);
      if (response.data.length > 0) {
        const avg = response.data.reduce((sum, review) => sum + review.rating, 0) / response.data.length;
        setAverageRating(avg.toFixed(1));
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [album.id]);

  const handleReviewAdded = () => {
    fetchReviews();
    setShowReviewForm(false);
  };

  const handleLike = async (reviewId) => {
    try {
      const response = await reviewsAPI.like(reviewId);
      if (response.data.status === 'liked' || response.data.status === 'unliked') {
        await fetchReviews();
      }
    } catch (error) {
      console.error('Error liking review:', error);
    }
  };

  const bioSnippet = album.artist_bio ? album.artist_bio.substring(0, 100) + (album.artist_bio.length > 100 ? '...' : '') : '';
  const showReadMore = album.artist_bio && album.artist_bio.length > 100;

  return (
    <Card elevation={6}
      sx={{
        width: 300,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        mx: 'auto',
        bgcolor: 'background.paper',
        boxShadow: 6,
        transition: 'transform 0.2s, box-shadow 0.2s, background 0.2s',
        '&:hover': {
          transform: 'translateY(-6px) scale(1.03)',
          boxShadow: 12,
          bgcolor: 'rgba(0,230,254,0.10)',
        },
      }}
    >
      {album.cover_image ? (
        <CardMedia
          component="img"
          height="180"
          image={album.cover_image}
          alt={`${album.title} cover`}
          sx={{ objectFit: 'cover', borderTopLeftRadius: 16, borderTopRightRadius: 16 }}
        />
      ) : (
        <Box
          sx={{ height: 180, bgcolor: 'grey.200', borderTopLeftRadius: 16, borderTopRightRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <ImageIcon size={48} style={{ color: '#BDBDBD' }} />
        </Box>
      )}
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', pb: 1 }}>
        <Typography variant="h6" component="div" gutterBottom noWrap>
          {album.title}
        </Typography>
        <Typography variant="subtitle2" color="text.secondary" noWrap>
          {album.artist_name}
        </Typography>
        {album.artist_bio && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {bioSnippet}
            {showReadMore && (
              <Button size="small" color="primary" onClick={() => setShowBioModal(true)}>
                Read more
              </Button>
            )}
          </Typography>
        )}
        <Typography variant="body2" color="text.secondary" noWrap>
          {album.genre} • {album.release_year}
        </Typography>
        <Box mt={1} mb={1}>
          <StarRating rating={Number(averageRating)} />
          <Typography variant="caption" color="text.secondary">
            {reviews.length} reviews
          </Typography>
        </Box>
      </CardContent>
      <CardActions sx={{ justifyContent: 'center', p: 1, mt: 'auto' }}>
        <Button
          size="small"
          variant="contained"
          onClick={() => setShowReviews((prev) => !prev)}
          endIcon={showReviews ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        >
          Reviews
        </Button>
      </CardActions>
      <Collapse in={showReviews} timeout="auto" unmountOnExit>
        <Box px={2} pb={2}>
          <Button
            fullWidth
            variant={showReviewForm ? 'outlined' : 'contained'}
            color="primary"
            size="small"
            sx={{ mb: 1 }}
            onClick={() => setShowReviewForm((prev) => !prev)}
          >
            {showReviewForm ? 'Cancel Review' : 'Write a Review'}
          </Button>
          {showReviewForm && (
            <ReviewForm albumId={album.id} onReviewAdded={handleReviewAdded} />
          )}
          <Box mt={2}>
            {reviews.map((review) => (
              <Card key={review.id} variant="outlined" sx={{ mb: 1, p: 1 }}>
                <Grid container alignItems="center" spacing={1}>
                  <Grid item>
                    <Avatar sx={{ width: 28, height: 28, bgcolor: 'grey.200', color: 'text.primary' }}>
                      <User size={16} />
                    </Avatar>
                  </Grid>
                  <Grid item xs>
                    <Typography variant="subtitle2">{review.username}</Typography>
                    <StarRating rating={review.rating} size={14} />
                  </Grid>
                  <Grid item>
                    <Button
                      size="small"
                      color={review.user_liked ? 'primary' : 'inherit'}
                      onClick={() => handleLike(review.id)}
                      startIcon={<ThumbsUp size={16} />}
                      sx={{ minWidth: 32 }}
                    >
                      {review.like_count || 0}
                    </Button>
                  </Grid>
                </Grid>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {review.review_text}
                </Typography>
              </Card>
            ))}
          </Box>
        </Box>
      </Collapse>
      <Modal
        open={showBioModal}
        onClose={() => setShowBioModal(false)}
        aria-labelledby="bio-modal-title"
        aria-describedby="bio-modal-description"
      >
        <Paper sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, p: 3, outline: 'none' }}>
          <Typography id="bio-modal-title" variant="h6" component="h2">
            {album.artist_name} - Biography
          </Typography>
          <Typography id="bio-modal-description" sx={{ mt: 2 }}>
            {album.artist_bio}
          </Typography>
          <Button onClick={() => setShowBioModal(false)} sx={{ mt: 2 }}>
            Close
          </Button>
        </Paper>
      </Modal>
    </Card>
  );
};

export default AlbumCard;