import React, { useState } from 'react';
import { authAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

const Signup = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const response = await authAPI.register({
                username: username,
                password: password
            });
            if (response.data.message === 'Account created successfully') {
                setSuccess('Account created! You can now log in.');
                setTimeout(() => navigate('/login'), 1500);
            } else {
                setError(response.data.message || 'Signup failed');
            }
        } catch (error) {
            setError(error.response?.data?.message || 'Signup failed');
        }
    };

    return (
        <Box maxWidth={400} mx="auto" mt={6} p={3} bgcolor="#23263A" borderRadius={2} boxShadow={3}>
            <Typography variant="h4" component="h2" color="primary" fontWeight={700} mb={2} align="center">
                Sign Up
            </Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    label="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    fullWidth
                    required
                    margin="normal"
                />
                <TextField
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    fullWidth
                    required
                    margin="normal"
                />
                {error && (
                    <Typography color="error" mt={1} mb={1} align="center">
                        {error}
                    </Typography>
                )}
                {success && (
                    <Typography color="success.main" mt={1} mb={1} align="center">
                        {success}
                    </Typography>
                )}
                <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                    Sign Up
                </Button>
            </form>
            <Typography variant="body2" align="center" mt={2}>
                Already have an account?{' '}
                <Button color="secondary" onClick={() => navigate('/login')} sx={{ textTransform: 'none', p: 0, minWidth: 0 }}>
                    Log in here
                </Button>
            </Typography>
        </Box>
    );
};

export default Signup;