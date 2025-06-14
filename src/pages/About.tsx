import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Avatar
} from '@mui/material';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import TheaterComedyIcon from '@mui/icons-material/TheaterComedy';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

const About = () => {
  const features = [
    {
      icon: <SportsSoccerIcon sx={{ fontSize: 40 }} />,
      title: 'Sports Coverage',
      description: 'Comprehensive coverage of various sports events, from local matches to international tournaments.'
    },
    {
      icon: <TheaterComedyIcon sx={{ fontSize: 40 }} />,
      title: 'Cultural Events',
      description: 'Stay updated with the latest cultural events, festivals, and artistic performances.'
    },
    {
      icon: <EmojiEventsIcon sx={{ fontSize: 40 }} />,
      title: 'Community Engagement',
      description: 'Join a vibrant community of sports and culture enthusiasts.'
    }
  ];

  return (
    <Box>
      <Paper
        elevation={0}
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          p: 4,
          mb: 4,
          borderRadius: 2
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          About Sports & Culture
        </Typography>
        <Typography variant="body1" paragraph>
          Welcome to Sports & Culture, your premier destination for sports events and cultural experiences.
          We bring together the best of both worlds, creating a platform where sports enthusiasts and
          culture lovers can find everything they need in one place.
        </Typography>
      </Paper>

      <Typography variant="h5" component="h2" gutterBottom>
        Our Mission
      </Typography>
      <Typography variant="body1" paragraph>
        Our mission is to bridge the gap between sports and culture, creating a community where
        people can discover, engage with, and celebrate both athletic achievements and cultural
        expressions. We believe that sports and culture are deeply interconnected, each enriching
        the other in unique ways.
      </Typography>

      <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4 }}>
        What We Offer
      </Typography>
      <Grid container spacing={4} sx={{ mt: 2 }}>
        {features.map((feature, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Box sx={{ mb: 2, color: 'primary.main' }}>
                  {feature.icon}
                </Box>
                <Typography variant="h6" component="h3" gutterBottom>
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {feature.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Paper sx={{ p: 4, mt: 4, bgcolor: 'grey.50' }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Contact Us
        </Typography>
        <Typography variant="body1">
          Have questions or suggestions? We'd love to hear from you! Reach out to us at:
        </Typography>
        <Typography variant="body1" sx={{ mt: 1 }}>
          Email: contact@sportsculture.com
        </Typography>
        <Typography variant="body1">
          Phone: +1 (555) 123-4567
        </Typography>
      </Paper>
    </Box>
  );
};

export default About; 