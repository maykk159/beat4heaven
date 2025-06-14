import React, { useState } from 'react';
import { reviewsAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';

const ReviewForm = ({ albumId, onReviewAdded }) => {
    const [rating, setRating] = useState(5);
    const [content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            await reviewsAPI.create({
                album: albumId,
                rating: rating,
                review_text: content
            });
            setContent('');
            setRating(5);
            if (onReviewAdded) onReviewAdded();
        } catch (error) {
            console.error('Error submitting review:', error);
            if (error.response?.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                navigate('/login');
            } else {
                setError(error.response?.data?.message || 'Failed to submit review. Please try again.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} bgcolor="#23263A" borderRadius={2} p={2}>
            {error && (
                <Typography color="error" mb={2}>
                    {error}
                </Typography>
            )}
            <Typography variant="subtitle1" fontWeight={600} mb={1}>
                Rating
            </Typography>
            <TextField
                select
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                fullWidth
                size="small"
                sx={{ mb: 2 }}
            >
                {[5, 4, 3, 2, 1].map(num => (
                    <MenuItem key={num} value={num}>{num} stars</MenuItem>
                ))}
            </TextField>
            <Typography variant="subtitle1" fontWeight={600} mb={1}>
                Your Review
            </Typography>
            <TextField
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                multiline
                minRows={4}
                fullWidth
                placeholder="Write your review here..."
                sx={{ mb: 2 }}
            />
            <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={isSubmitting}
            >
                {isSubmitting ? 'Submitting...' : 'Submit Review'}
            </Button>
        </Box>
    );
};

export default ReviewForm;