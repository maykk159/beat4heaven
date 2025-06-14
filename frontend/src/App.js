import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link as RouterLink, useNavigate } from 'react-router-dom';
import Homepage from './components/Homepage';
import AlbumList from './components/AlbumList';
import Login from './components/Login';
import Signup from './components/Signup';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import './App.css';

const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#6C63FF',
        },
        secondary: {
            main: '#00E6FE',
        },
        background: {
            default: '#181A20',
            paper: '#23263A',
        },
        text: {
            primary: '#F4F6FB',
            secondary: '#B2B7C2',
        },
    },
    shape: {
        borderRadius: 16,
    },
    typography: {
        fontFamily: 'Montserrat, Inter, Roboto, Arial, sans-serif',
        h6: { fontWeight: 700 },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    textTransform: 'none',
                    fontWeight: 500,
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 20,
                    background: '#23263A',
                    color: '#F4F6FB',
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    background: 'linear-gradient(90deg, #6C63FF 0%, #00E6FE 100%)',
                },
            },
        },
    },
});

function Navbar() {
    const navigate = useNavigate();
    const isLoggedIn = !!localStorage.getItem('token');

    const handleSignOut = (e) => {
        e.preventDefault();
        
        localStorage.clear(); 
        sessionStorage.clear(); 
        
        document.cookie.split(";").forEach(function(c) { 
            document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
        });
        
        window.location.href = '/login';
    };

    const buttonStyle = {
        fontSize: '1rem',
        padding: '8px 20px',
        fontWeight: 600,
        borderRadius: '30px',
        transition: 'all 0.3s ease',
        textTransform: 'none',
        border: '2px solid rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        color: '#FFFFFF',
        '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        }
    };

    return (
        <AppBar 
            position="sticky" 
            elevation={0}
            sx={{
                background: 'rgba(35, 38, 58, 0.95)',
                backdropFilter: 'blur(10px)',
                borderRadius: { xs: 0, md: '0 0 20px 20px' },
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            }}
        >
            <Toolbar sx={{ py: 1 }}>
                <Typography
                    variant="h6"
                    component={RouterLink}
                    to="/"
                    sx={{ 
                        flexGrow: 1, 
                        textDecoration: 'none', 
                        color: 'inherit', 
                        fontWeight: 700, 
                        display: 'flex', 
                        alignItems: 'center' 
                    }}
                >
                    <img 
                        src="/beat4heavenlogo.png" 
                        alt="Beat4Heaven Logo" 
                        style={{ 
                            height: 80, 
                            marginRight: 12,
                            transition: 'transform 0.3s ease',
                            '&:hover': {
                                transform: 'scale(1.05)'
                            }
                        }} 
                    />
                    Beat4Heaven
                </Typography>
                <Stack direction="row" spacing={2}>
                    <Button 
                        component={RouterLink} 
                        to="/albums"
                        sx={{
                            ...buttonStyle,
                            backgroundColor: '#6C63FF',
                            color: '#FFFFFF',
                            '&:hover': {
                                backgroundColor: '#5650CC',
                                color: '#FFFFFF',
                            }
                        }}
                    >
                        Albums
                    </Button>
                    {isLoggedIn ? (
                        <Button 
                            onClick={handleSignOut}
                            sx={{
                                ...buttonStyle,
                                backgroundColor: '#FF6B6B',
                                color: '#FFFFFF',
                                '&:hover': {
                                    backgroundColor: '#FF5252',
                                    color: '#FFFFFF',
                                }
                            }}
                        >
                            Sign Out
                        </Button>
                    ) : (
                        <>
                            <Button 
                                component={RouterLink} 
                                to="/login"
                                sx={{
                                    ...buttonStyle,
                                    backgroundColor: 'transparent',
                                    color: '#FFFFFF',
                                    '&:hover': {
                                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                    }
                                }}
                            >
                                Login
                            </Button>
                            <Button 
                                component={RouterLink} 
                                to="/signup"
                                sx={{
                                    ...buttonStyle,
                                    backgroundColor: '#00E6FE',
                                    color: '#23263A',
                                    fontWeight: 700, 
                                    '&:hover': {
                                        backgroundColor: '#00CCFF',
                                        color: '#23263A',
                                    }
                                }}
                            >
                                Sign Up
                            </Button>
                        </>
                    )}
                </Stack>
            </Toolbar>
        </AppBar>
    );
}

function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Router>
                <Navbar />
                <Box className="content">
                    <Routes>
                        <Route path="/" element={<Homepage />} />
                        <Route path="/albums" element={<AlbumList />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<Signup />} />
                    </Routes>
                </Box>
            </Router>
        </ThemeProvider>
    );
}

export default App;