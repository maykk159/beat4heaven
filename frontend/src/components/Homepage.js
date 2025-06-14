import React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

const Homepage = () => (
  <>
    {/* Hero Section */}
    <Box
      sx={{
        background: 'linear-gradient(45deg, #23263A 30%, #181A20 90%)',
        color: 'white',
        py: 12,
        borderRadius: '0 0 50px 50px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
      }}
    >
      <Container maxWidth="lg">
        <Box textAlign="center" maxWidth={800} mx="auto">
          <Typography 
            variant="h1" 
            component="h1" 
            gutterBottom 
            sx={{
              fontWeight: 800,
              fontSize: { xs: '2.5rem', md: '4rem' },
              background: 'linear-gradient(45deg, #FFC247 30%, #FF6B6B 90%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              mb: 4
            }}
          >
            Welcome to Beat4Heaven
          </Typography>
          <Typography 
            variant="h5" 
            sx={{ 
              color: '#FFC247',
              mb: 3,
              fontWeight: 500
            }}
          >
            Discover, review, and share your favorite albums and artists.
          </Typography>
          <Typography variant="body1" color="grey.300">
            Browse albums, read reviews, and add your own thoughts. Join our community of music lovers and help others find their next favorite album!
          </Typography>
        </Box>
      </Container>
    </Box>

    {/* What are we doing section */}
    <Container maxWidth="lg" sx={{ my: 12 }}>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Typography 
            variant="h3" 
            component="h2" 
            gutterBottom 
            fontWeight={700} 
            color="primary"
            textAlign="center"
            sx={{ mb: 6 }}
          >
            What are we doing?
          </Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card elevation={4} sx={{ height: '100%', borderRadius: 4 }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" gutterBottom color="primary">
                Music Discovery Platform
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Beat4Heaven is a web-based platform designed for music lovers to search for albums, leave reviews, and rate music across all genres. Users can explore other listeners' ratings and comments, making music discovery more social and engaging.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card elevation={4} sx={{ height: '100%', borderRadius: 4 }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" gutterBottom color="primary">
                Community-Driven Reviews
              </Typography>
              <Typography variant="body1" color="text.secondary">
                In a world where music reviews are scattered across blogs, forums, and media outlets, Beat4Heaven brings everything together in one place—powered by real opinions, not industry hype.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>

    {/* Footer Section */}
    <Box component="footer" sx={{
      width: '100%',
      bgcolor: '#23263A',
      color: '#FFC247',
      borderRadius: '50px 50px 0 0',
      overflow: 'hidden',
      mt: 12,
    }}>
      <Container maxWidth="lg">
        <Grid container spacing={4} sx={{ py: 6 }}>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
              <img src="/beat4heavenlogo.png" alt="Beat4Heaven Logo" style={{ height: 180 }} />
            </Box>
          </Grid>
          <Grid item xs={12} md={8}>
            <Grid container spacing={4}>
              <Grid item xs={6}>
                <Typography variant="h6" fontWeight={700} color="#FFC247" gutterBottom>
                  Github
                </Typography>
                <Typography component="a" href="https://github.com/maykk159" target="_blank" rel="noopener" color="white" sx={{ display: 'block', textDecoration: 'none', mb: 1, '&:hover': { color: '#FFC247' } }}>
                  Enes
                </Typography>
                <Typography component="a" href="https://github.com/dantehho" target="_blank" rel="noopener" color="white" sx={{ display: 'block', textDecoration: 'none', '&:hover': { color: '#FFC247' } }}>
                  Mahmuthan
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="h6" fontWeight={700} color="#FFC247" gutterBottom>
                  Instagram
                </Typography>
                <Typography component="a" href="https://instagram.com/enesss_c" target="_blank" rel="noopener" color="white" sx={{ display: 'block', textDecoration: 'none', mb: 1, '&:hover': { color: '#FFC247' } }}>
                  Enes
                </Typography>
                <Typography component="a" href="https://instagram.com/dante.hho" target="_blank" rel="noopener" color="white" sx={{ display: 'block', textDecoration: 'none', '&:hover': { color: '#FFC247' } }}>
                  Mahmuthan
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>
      <Box sx={{ width: '100%', bgcolor: '#181A20', color: 'white', py: 2, textAlign: 'center' }}>
        <Typography variant="subtitle1" fontWeight={700}>
          Design and programming : Enes Camkaya & Mahmuthan Hacıhasanoğlu
        </Typography>
      </Box>
    </Box>
  </>
);

export default Homepage;