import React, { useState } from 'react';
import { authAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMsg, setSnackbarMsg] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess(false);

        try {
            const response = await authAPI.login({
                username: username,
                password: password
            });

            if (response.data.token) {
                localStorage.setItem('user', JSON.stringify({
                    username: response.data.username,
                    id: response.data.userId
                }));
                localStorage.setItem('token', response.data.token);
                setSnackbarMsg('Login successful!');
                setSnackbarSeverity('success');
                setSnackbarOpen(true);
                setSuccess(true);
                setTimeout(() => navigate('/albums'), 1200);
            } else {
                setError(response.data.message || 'Login failed');
                setSnackbarMsg(response.data.message || 'Login failed');
                setSnackbarSeverity('error');
                setSnackbarOpen(true);
            }
        } catch (error) {
            setError(error.response?.data?.message || 'Invalid username or password');
            setSnackbarMsg(error.response?.data?.message || 'Invalid username or password');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') return;
        setSnackbarOpen(false);
    };

    return (
        <Box maxWidth={400} mx="auto" mt={6} p={3} bgcolor="#23263A" borderRadius={2} boxShadow={3}>
            <Typography variant="h4" component="h2" color="primary" fontWeight={700} mb={2} align="center">
                Login
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
                <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                    Login
                </Button>
            </form>
            <Typography variant="body2" align="center" mt={2}>
                Don't have an account?{' '}
                <Button color="secondary" onClick={() => navigate('/signup')} sx={{ textTransform: 'none', p: 0, minWidth: 0 }}>
                    Sign up here
                </Button>
            </Typography>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={2500}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMsg}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default Login;