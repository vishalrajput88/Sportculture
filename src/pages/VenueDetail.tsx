import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Grid,
  Paper,
  Rating,
  Chip,
  Button,
  Divider,
  IconButton,
  Tab,
  Tabs,
} from '@mui/material';
import {
  LocationOn,
  AccessTime,
  Phone,
  Email,
  Share,
  Favorite,
  FavoriteBorder,
} from '@mui/icons-material';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

interface Venue {
  id: number;
  name: string;
  city: string;
  sport: string;
  price: number;
  rating: number;
  images: string[];
  availableSlots: { date: string; time: string }[];
  facilities: string[];
  location: { lat: number; lng: number };
  address: string;
  description: string;
  contact: {
    phone: string;
    email: string;
  };
  openingHours: {
    [key: string]: string;
  };
}

const VenueDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [venue, setVenue] = useState<Venue | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | null>(dayjs());
  const [selectedTime, setSelectedTime] = useState<dayjs.Dayjs | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const fetchVenueDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:3000/api/turfs/${id}`);
        if (!response.ok) throw new Error('Failed to fetch venue details');
        const data = await response.json();
        setVenue(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVenueDetails();
  }, [id]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleBookNow = () => {
    // Implement booking logic
    console.log('Booking venue:', venue?.id);
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!venue) return <Typography>Venue not found</Typography>;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Image Gallery */}
      <Box sx={{ position: 'relative', mb: 4 }}>
        <Box
          component="img"
          src={venue.images[currentImageIndex]}
          alt={venue.name}
          sx={{
            width: '100%',
            height: 400,
            objectFit: 'cover',
            borderRadius: 2,
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: 16,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: 1,
          }}
        >
          {venue.images.map((_, index) => (
            <Box
              key={index}
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                bgcolor: index === currentImageIndex ? 'white' : 'rgba(255, 255, 255, 0.5)',
                cursor: 'pointer',
              }}
              onClick={() => setCurrentImageIndex(index)}
            />
          ))}
        </Box>
      </Box>

      <Grid container spacing={4}>
        {/* Main Content */}
        <Grid item xs={12} md={8}>
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h4" component="h1">
                {venue.name}
              </Typography>
              <Box>
                <IconButton onClick={() => setIsFavorite(!isFavorite)}>
                  {isFavorite ? <Favorite color="error" /> : <FavoriteBorder />}
                </IconButton>
                <IconButton>
                  <Share />
                </IconButton>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Rating value={venue.rating} precision={0.5} readOnly />
              <Typography variant="body2" color="text.secondary">
                ({venue.rating})
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <LocationOn sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                {venue.address}
              </Typography>
            </Box>
            <Typography variant="body1" paragraph>
              {venue.description}
            </Typography>
          </Box>

          {/* Tabs Section */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <Tabs value={activeTab} onChange={handleTabChange}>
              <Tab label="Facilities" />
              <Tab label="Opening Hours" />
              <Tab label="Location" />
            </Tabs>
          </Box>

          {/* Tab Content */}
          <Box sx={{ mb: 4 }}>
            {activeTab === 0 && (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {venue.facilities.map((facility, index) => (
                  <Chip key={index} label={facility} />
                ))}
              </Box>
            )}
            {activeTab === 1 && (
              <Box>
                {Object.entries(venue.openingHours).map(([day, hours]) => (
                  <Box key={day} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body1">{day}</Typography>
                    <Typography variant="body1">{hours}</Typography>
                  </Box>
                ))}
              </Box>
            )}
            {activeTab === 2 && (
              <Box sx={{ height: 300, bgcolor: 'grey.200' }}>
                {/* Add map component here */}
                <Typography>Map will be displayed here</Typography>
              </Box>
            )}
          </Box>
        </Grid>

        {/* Booking Sidebar */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, position: 'sticky', top: 24 }}>
            <Typography variant="h5" gutterBottom>
              Book Now
            </Typography>
            <Typography variant="h4" color="primary" gutterBottom>
              ₹{venue.price}/hour
            </Typography>
            <Divider sx={{ my: 2 }} />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Box sx={{ mb: 2 }}>
                <DatePicker
                  label="Select Date"
                  value={selectedDate}
                  onChange={(newValue) => setSelectedDate(newValue)}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </Box>
              <Box sx={{ mb: 2 }}>
                <TimePicker
                  label="Select Time"
                  value={selectedTime}
                  onChange={(newValue) => setSelectedTime(newValue)}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </Box>
            </LocalizationProvider>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              onClick={handleBookNow}
              sx={{ mb: 2 }}
            >
              Book Now
            </Button>
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Contact Information
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Phone sx={{ mr: 1 }} />
                <Typography variant="body2">{venue.contact.phone}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Email sx={{ mr: 1 }} />
                <Typography variant="body2">{venue.contact.email}</Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default VenueDetail; 